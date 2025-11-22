"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { industries } from "@/lib/mockData/industries";

import {
  INPUT_DEBOUNCE,
  THEME_LIMIT,
  plan2Documents,
  plan2SurveyPrompts,
  scoreDimensionLabels,
  specializedThemes as specializedThemeDefinitions,
  themeDefinitions,
} from "./constants";
import {
  ChecklistState,
  DerivedState,
  EmployeesRange,
  Plan0State,
  Plan2ScoreHint,
  SpecializedThemeId,
  ThemeId,
  TimeHorizon,
  Urgency,
  ValidationErrors,
} from "./types";

export type Plan0Draft = {
  companyName: string;
  prefecture: string;
  industrySelect: string;
  industryFree: string;
  employeesRange: EmployeesRange;
  revenueRange: "0-100M" | "100-500M" | "500M-1B" | "1B+" | "";
  foundedYear: string;
  themes: ThemeId[];
  timeHorizon: TimeHorizon;
  urgency: Urgency;
  specializedThemes: SpecializedThemeId[];
};

const initialDraft: Plan0Draft = {
  companyName: "",
  prefecture: "",
  industrySelect: "",
  industryFree: "",
  employeesRange: "",
  revenueRange: "",
  foundedYear: "",
  themes: [],
  timeHorizon: "",
  urgency: "",
  specializedThemes: [],
};

const draftToState = (draft: Plan0Draft): Plan0State => ({
  companyName: draft.companyName.trim(),
  prefecture: draft.prefecture,
  industrySelect: draft.industrySelect ? draft.industrySelect : null,
  industryFree: draft.industryFree.trim() ? draft.industryFree.trim() : null,
  employeesRange: draft.employeesRange,
  revenueRange: draft.revenueRange,
  foundedYear: draft.foundedYear.trim()
    ? Number.parseInt(draft.foundedYear.trim(), 10)
    : null,
  themes: Array.from(new Set(draft.themes)),
  timeHorizon: draft.timeHorizon,
  urgency: draft.urgency,
  specializedThemes: Array.from(new Set(draft.specializedThemes)),
});

const maskKeys: (keyof Plan0State)[] = ["companyName", "industryFree"];

const computeDiff = (prev: Plan0State, next: Plan0State) => {
  const diff: Record<string, unknown> = {};
  (Object.keys(next) as (keyof Plan0State)[]).forEach((key) => {
    const previous = prev[key];
    const current = next[key];
    const changed = Array.isArray(previous) || Array.isArray(current)
      ? JSON.stringify(previous) !== JSON.stringify(current)
      : previous !== current;
    if (!changed) {
      return;
    }
    diff[key] = maskKeys.includes(key) ? "[masked]" : current;
  });
  return diff;
};

const currentYear = new Date().getFullYear();

const validateDraft = (draft: Plan0Draft): ValidationErrors => {
  const errors: ValidationErrors = {};
  const name = draft.companyName.trim();
  if (!name) {
    errors.companyName = "2〜80文字の会社名をご入力ください。";
  } else if (name.length < 2 || name.length > 80) {
    errors.companyName = "2〜80文字の範囲で入力してください。";
  }

  if (!draft.prefecture) {
    errors.prefecture = "都道府県を選択してください。";
  }

  const hasIndustrySelect = !!draft.industrySelect;
  const hasIndustryFree = !!draft.industryFree.trim();
  if ((hasIndustrySelect && hasIndustryFree) || (!hasIndustrySelect && !hasIndustryFree)) {
    errors.industryGroup = "業種は「選択」または「自由記述」のどちらか一方をご入力ください。";
  }

  if (!draft.employeesRange) {
    errors.employeesRange = "従業員数レンジを選んでください。";
  }

  if (!draft.revenueRange) {
    errors.revenueRange = "売上高レンジを選んでください。";
  }

  if (draft.foundedYear.trim()) {
    const numeric = Number.parseInt(draft.foundedYear.trim(), 10);
    const isValid =
      Number.isInteger(numeric) &&
      numeric >= 1900 &&
      numeric <= currentYear;
    if (!isValid) {
      errors.foundedYear = "1900〜今年の西暦4桁で入力してください。";
    }
  }

  if (draft.themes.length === 0) {
    errors.themes = "相談テーマを1〜3件選択してください。";
  }

  if (!draft.timeHorizon) {
    errors.timeHorizon = "希望する時間軸を選んでください。";
  }

  if (!draft.urgency) {
    errors.urgency = "対応の優先度を選んでください。";
  }

  return errors;
};

const computeScoreHints = (state: Plan0State): Plan2ScoreHint[] => {
  const themeSet = new Set<ThemeId>(state.themes);
  const trendFromHorizon = (horizon: TimeHorizon) => {
    switch (horizon) {
      case "3m":
        return "down";
      case "1y":
        return "flat";
      case "3y":
        return "up";
      default:
        return "flat";
    }
  };

  const liquidityColor = themeSet.has("finance")
    ? state.urgency === "now"
      ? "red"
      : "yellow"
    : "green";
  const marginColor = themeSet.has("profit")
    ? state.urgency === "now"
      ? "red"
      : "yellow"
    : themeSet.has("sales")
      ? "yellow"
      : "green";
  const concentrationColor = themeSet.has("sales")
    ? state.timeHorizon === "3m"
      ? "red"
      : "yellow"
    : "green";
  const organizationColor = themeSet.has("people")
    ? state.urgency === "now"
      ? "red"
      : "yellow"
    : themeSet.has("comprehensive")
      ? "yellow"
      : "green";
  const digitalColor = themeSet.has("itDx")
    ? state.timeHorizon === "3m"
      ? "yellow"
      : "red"
    : themeSet.has("comprehensive")
      ? "yellow"
      : "green";

  const trend = trendFromHorizon(state.timeHorizon);

  const hints: Plan2ScoreHint[] = [
    {
      id: "liquidity",
      label: scoreDimensionLabels.liquidity,
      color: liquidityColor,
      trend,
      rationale: themeSet.has("finance")
        ? "資金繰りの論点が主テーマのため、短期資金リスクを優先確認します。"
        : "資金繰りは主要テーマ外ですが、全体診断で早期把握します。",
    },
    {
      id: "margin",
      label: scoreDimensionLabels.margin,
      color: marginColor,
      trend,
      rationale: themeSet.has("profit")
        ? "粗利改善が必要との想定で、費目別の点検を提案します。"
        : themeSet.has("sales")
          ? "売上構造の見直しと併せて粗利水準を確認します。"
          : "粗利は現時点で急ぎではありませんが、指標を定期確認します。",
    },
    {
      id: "concentration",
      label: scoreDimensionLabels.concentration,
      color: concentrationColor,
      trend,
      rationale: themeSet.has("sales")
        ? "販路・顧客集中の把握が必要なため、構成比の提出を依頼します。"
        : "顧客構成は重大リスクと想定していません。主要顧客をヒアリングします。",
    },
    {
      id: "organization",
      label: scoreDimensionLabels.organization,
      color: organizationColor,
      trend,
      rationale: themeSet.has("people")
        ? "人材・組織課題が主要テーマのため、体制の棚卸しを優先します。"
        : "組織課題は補足論点として確認し、必要に応じて深掘りします。",
    },
    {
      id: "digital",
      label: scoreDimensionLabels.digital,
      color: digitalColor,
      trend,
      rationale: themeSet.has("itDx")
        ? "IT・DXの遅れを解消するため、現行システムの棚卸しを行います。"
        : "DXは補足論点として、全体診断の結果に応じて着手可否を判断します。",
    },
  ];

  return hints;
};

const computeDerivedState = (state: Plan0State): DerivedState => {
  const showPlan2 = state.themes.includes("comprehensive");
  const anyDeepTheme = state.themes.some((themeId) => {
    const definition = themeDefinitions.find((theme) => theme.id === themeId);
    return definition?.depth === "deep";
  });
  const showPlan3Suggestion = state.urgency === "now" || anyDeepTheme;
  const isProvisionalFinal =
    state.urgency === "now" &&
    (state.themes.length >= 2 || showPlan2);
  return {
    showPlan1: state.themes,
    showPlan2,
    showPlan3Suggestion,
    showPlan4: state.specializedThemes.length > 0,
    showTeaser: state.specializedThemes.length === 0,
    isProvisionalFinal,
    scoreHints: computeScoreHints(state),
  };
};

export type ErrorSummaryItem = { id: string; message: string };

export const useConsultationPlanner = () => {
  const [draft, setDraft] = useState<Plan0Draft>(initialDraft);
  const [plan0, setPlan0] = useState<Plan0State>(() => draftToState(initialDraft));
  const [checklist, setChecklist] = useState<ChecklistState>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const snackbarTimer = useRef<number | null>(null);
  const [liveMessage, setLiveMessage] = useState<string>("");
  const debounceTimers = useRef<Record<string, number | undefined>>({});

  const applyPlan0Update = useCallback(
    (updater: (prev: Plan0State) => Plan0State) => {
      setPlan0((previous) => {
        const next = updater(previous);
        const diff = computeDiff(previous, next);
        if (Object.keys(diff).length > 0) {
          console.log("state:update", diff);
          return next;
        }
        return previous;
      });
    },
    [],
  );

  const scheduleDebouncedUpdate = useCallback(
    (field: "companyName" | "industryFree" | "foundedYear", value: string) => {
      if (typeof window === "undefined") {
        return;
      }
      const timerKey = `${field}`;
      const existing = debounceTimers.current[timerKey];
      if (existing) {
        window.clearTimeout(existing);
      }
      debounceTimers.current[timerKey] = window.setTimeout(() => {
        applyPlan0Update((prev) => {
          switch (field) {
            case "companyName":
              return { ...prev, companyName: value.trim() };
            case "industryFree": {
              return {
                ...prev,
                industryFree: value.trim() ? value.trim() : null,
                industrySelect: null,
              };
            }
            case "foundedYear": {
              const trimmed = value.trim();
              const parsed = trimmed ? Number.parseInt(trimmed, 10) : null;
              return {
                ...prev,
                foundedYear: Number.isFinite(parsed) ? (parsed as number) : null,
              };
            }
            default:
              return prev;
          }
        });
      }, INPUT_DEBOUNCE);
    },
    [applyPlan0Update],
  );

  const showSnackbar = useCallback((message: string) => {
    if (typeof window !== "undefined" && snackbarTimer.current) {
      window.clearTimeout(snackbarTimer.current);
    }
    setSnackbar(message);
    if (typeof window !== "undefined") {
      snackbarTimer.current = window.setTimeout(() => {
        setSnackbar(null);
      }, 3200);
    }
  }, []);

  const notifyThemeLimit = useCallback(
    () => showSnackbar("選択は最大3件までです。"),
    [showSnackbar],
  );

  const updateCompanyName = useCallback(
    (value: string) => {
      setDraft((prev) => ({ ...prev, companyName: value }));
      scheduleDebouncedUpdate("companyName", value);
    },
    [scheduleDebouncedUpdate],
  );

  const updatePrefecture = useCallback(
    (value: string) => {
      setDraft((prev) => ({ ...prev, prefecture: value }));
      applyPlan0Update((prev) => ({ ...prev, prefecture: value }));
    },
    [applyPlan0Update],
  );

  const updateIndustrySelect = useCallback(
    (value: string) => {
      setDraft((prev) => ({
        ...prev,
        industrySelect: value,
        industryFree: "",
      }));
      applyPlan0Update((prev) => ({
        ...prev,
        industrySelect: value ? value : null,
        industryFree: null,
      }));
    },
    [applyPlan0Update],
  );

  const updateIndustryFree = useCallback(
    (value: string) => {
      setDraft((prev) => ({
        ...prev,
        industryFree: value,
        industrySelect: "",
      }));
      applyPlan0Update((prev) => ({ ...prev, industrySelect: null }));
      scheduleDebouncedUpdate("industryFree", value);
    },
    [applyPlan0Update, scheduleDebouncedUpdate],
  );

  const updateEmployeesRange = useCallback(
    (value: EmployeesRange) => {
      setDraft((prev) => ({ ...prev, employeesRange: value }));
      applyPlan0Update((prev) => ({ ...prev, employeesRange: value }));
    },
    [applyPlan0Update],
  );

  const updateRevenueRange = useCallback(
    (value: Plan0Draft["revenueRange"]) => {
      setDraft((prev) => ({ ...prev, revenueRange: value }));
      applyPlan0Update((prev) => ({ ...prev, revenueRange: value }));
    },
    [applyPlan0Update],
  );

  const updateFoundedYear = useCallback(
    (value: string) => {
      setDraft((prev) => ({ ...prev, foundedYear: value }));
      scheduleDebouncedUpdate("foundedYear", value);
    },
    [scheduleDebouncedUpdate],
  );

  const updateTimeHorizon = useCallback(
    (value: TimeHorizon) => {
      setDraft((prev) => ({ ...prev, timeHorizon: value }));
      applyPlan0Update((prev) => ({ ...prev, timeHorizon: value }));
    },
    [applyPlan0Update],
  );

  const updateUrgency = useCallback(
    (value: Urgency) => {
      setDraft((prev) => ({ ...prev, urgency: value }));
      applyPlan0Update((prev) => ({ ...prev, urgency: value }));
    },
    [applyPlan0Update],
  );

  const toggleTheme = useCallback(
    (themeId: ThemeId) => {
      setDraft((prev) => {
        const exists = prev.themes.includes(themeId);
        if (!exists && prev.themes.length >= THEME_LIMIT) {
          notifyThemeLimit();
          return prev;
        }
        const nextThemes = exists
          ? prev.themes.filter((item) => item !== themeId)
          : [...prev.themes, themeId];
        applyPlan0Update((prevState) => ({ ...prevState, themes: nextThemes }));
        return { ...prev, themes: nextThemes };
      });
    },
    [applyPlan0Update, notifyThemeLimit],
  );

  const toggleSpecializedTheme = useCallback(
    (id: SpecializedThemeId) => {
      setDraft((prev) => {
        const exists = prev.specializedThemes.includes(id);
        const next = exists
          ? prev.specializedThemes.filter((item) => item !== id)
          : [...prev.specializedThemes, id];
        applyPlan0Update((prevState) => ({
          ...prevState,
          specializedThemes: next,
        }));
        return { ...prev, specializedThemes: next };
      });
    },
    [applyPlan0Update],
  );

  const resetAll = useCallback(() => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "すべての入力をクリアします。よろしいですか？",
      );
      if (!confirmed) {
        return;
      }
    }
    setDraft(initialDraft);
    setChecklist({});
    setErrors({});
    setLiveMessage("");
    setSnackbar(null);
    applyPlan0Update(() => draftToState(initialDraft));
  }, [applyPlan0Update]);

  const derived = useMemo(() => computeDerivedState(plan0), [plan0]);

  const prevDerived = useRef<DerivedState | null>(null);

  useEffect(() => {
    setErrors(validateDraft(draft));
  }, [draft]);

  useEffect(() => {
    setChecklist((prev) => {
      const next: ChecklistState = {};
      plan0.themes.forEach((themeId) => {
        const definition = themeDefinitions.find((theme) => theme.id === themeId);
        if (!definition) {
          return;
        }
        const previousThemeState = prev[themeId] ?? {};
        const docsState: Record<string, boolean> = {};
        definition.plan1.forEach((doc) => {
          docsState[doc.id] = previousThemeState[doc.id] ?? false;
        });
        next[themeId] = docsState;
      });
      return next;
    });
  }, [plan0.themes]);

  useEffect(() => {
    const previous = prevDerived.current;
    if (
      !previous ||
      JSON.stringify(previous) !== JSON.stringify(derived)
    ) {
      console.log("derived:recompute", {
        plan1: derived.showPlan1,
        plan2: derived.showPlan2,
        plan3: derived.showPlan3Suggestion,
        plan4: derived.showPlan4,
        final: derived.isProvisionalFinal,
      });
      if (previous?.showPlan2 && !derived.showPlan2) {
        setLiveMessage("総合診断の表示を終了しました。");
      } else {
        setLiveMessage("表示内容を更新しました。");
      }
      if (!previous?.showTeaser && derived.showTeaser) {
        console.log("ui:proposal:teaserShown");
      }
      if (!previous?.isProvisionalFinal && derived.isProvisionalFinal) {
        console.log("ui:proposal:finalShown");
      }
      prevDerived.current = derived;
    }
  }, [derived]);

  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      if (typeof window !== "undefined") {
        Object.values(timers).forEach((timer) => {
          if (timer) {
            window.clearTimeout(timer);
          }
        });
        if (snackbarTimer.current) {
          window.clearTimeout(snackbarTimer.current);
        }
      }
    };
  }, []);

  const toggleChecklistItem = useCallback(
    (themeId: ThemeId, docId: string) => {
      setChecklist((prev) => {
        const currentTheme = prev[themeId] ?? {};
        const nextTheme = {
          ...currentTheme,
          [docId]: !currentTheme[docId],
        };
        return {
          ...prev,
          [themeId]: nextTheme,
        };
      });
    },
    [],
  );

  const closeSnackbar = useCallback(() => setSnackbar(null), []);

  const errorSummary: ErrorSummaryItem[] = useMemo(() => {
    const summary: ErrorSummaryItem[] = [];
    if (errors.companyName) {
      summary.push({ id: "companyName", message: errors.companyName });
    }
    if (errors.prefecture) {
      summary.push({ id: "prefecture", message: errors.prefecture });
    }
    if (errors.industryGroup) {
      summary.push({ id: "industry-group", message: errors.industryGroup });
    }
    if (errors.employeesRange) {
      summary.push({ id: "employeesRange", message: errors.employeesRange });
    }
    if (errors.revenueRange) {
      summary.push({ id: "revenueRange", message: errors.revenueRange });
    }
    if (errors.foundedYear) {
      summary.push({ id: "foundedYear", message: errors.foundedYear });
    }
    if (errors.themes) {
      summary.push({ id: "themes", message: errors.themes });
    }
    if (errors.timeHorizon) {
      summary.push({ id: "timeHorizon", message: errors.timeHorizon });
    }
    if (errors.urgency) {
      summary.push({ id: "urgency", message: errors.urgency });
    }
    return summary;
  }, [errors]);

  const isThemeDisabled = useCallback(
    (themeId: ThemeId) =>
      !draft.themes.includes(themeId) && draft.themes.length >= THEME_LIMIT,
    [draft.themes],
  );

  return {
    draft,
    plan0,
    derived,
    checklist,
    errors,
    errorSummary,
    snackbar,
    liveMessage,
    industries,
    themeDefinitions,
    specializedThemes: specializedThemeDefinitions,
    plan2Documents,
    plan2SurveyPrompts,
    updateCompanyName,
    updatePrefecture,
    updateIndustrySelect,
    updateIndustryFree,
    updateEmployeesRange,
    updateRevenueRange,
    updateFoundedYear,
    updateTimeHorizon,
    updateUrgency,
    toggleTheme,
    toggleSpecializedTheme,
    toggleChecklistItem,
    isThemeDisabled,
    resetAll,
    closeSnackbar,
    notifyThemeLimit,
  } as const;
};

