"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  FoodMainCategory,
  KsunsFormData,
  KsunsSimulationResult,
  KsunsTimeSlot,
} from "@/lib/types";
import { simulateKsunsResult } from "@/lib/mockData/ksunsSimulation";

type KsunsPlannerContextValue = {
  mainCategory: FoodMainCategory | null;
  subCategory: string | null;
  form: KsunsFormData;
  result: KsunsSimulationResult | null;
  isLoading: boolean;
  selectMainCategory: (category: FoodMainCategory) => void;
  selectSubCategory: (subCategory: string) => void;
  updateFormField: <K extends keyof KsunsFormData>(
    key: K,
    value: KsunsFormData[K],
  ) => void;
  updateTimeSlot: (slotId: string, patch: Partial<KsunsTimeSlot>) => void;
  addTimeSlot: () => void;
  removeTimeSlot: (slotId: string) => void;
  generateSimulation: () => Promise<KsunsSimulationResult> | null;
  resetResult: () => void;
};

const initialTimeSlots: KsunsTimeSlot[] = [
  { id: "slot-lunch", label: "ランチタイム", start: "11:00", end: "14:00" },
  { id: "slot-dinner", label: "ディナータイム", start: "17:00", end: "22:00" },
];

const initialForm: KsunsFormData = {
  seats: "",
  unitPrice: "",
  timeSlots: initialTimeSlots,
  locationProfile: "駅チカ",
  notes: "",
};

const KsunsPlannerContext = createContext<KsunsPlannerContextValue | undefined>(
  undefined,
);

export const KsunsPlannerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mainCategory, setMainCategory] = useState<FoodMainCategory | null>(
    null,
  );
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [form, setForm] = useState<KsunsFormData>(initialForm);
  const [result, setResult] = useState<KsunsSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectMainCategory = useCallback((category: FoodMainCategory) => {
    setMainCategory(category);
    setSubCategory(null);
    setResult(null);
  }, []);

  const selectSubCategory = useCallback((sub: string) => {
    setSubCategory(sub);
    setResult(null);
  }, []);

  const updateFormField = useCallback(
    <K extends keyof KsunsFormData>(key: K, value: KsunsFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setResult(null);
    },
    [],
  );

  const updateTimeSlot = useCallback(
    (slotId: string, patch: Partial<KsunsTimeSlot>) => {
      setForm((prev) => ({
        ...prev,
        timeSlots: prev.timeSlots.map((slot) =>
          slot.id === slotId ? { ...slot, ...patch } : slot,
        ),
      }));
      setResult(null);
    },
    [],
  );

  const addTimeSlot = useCallback(() => {
    setForm((prev) => {
      if (prev.timeSlots.length >= 4) {
        return prev;
      }
      const nextIndex = prev.timeSlots.length + 1;
      return {
        ...prev,
        timeSlots: [
          ...prev.timeSlots,
          {
            id: `slot-${Date.now()}`,
            label: `追加枠${nextIndex}`,
            start: "10:00",
            end: "12:00",
          },
        ],
      };
    });
    setResult(null);
  }, []);

  const removeTimeSlot = useCallback((slotId: string) => {
    setForm((prev) => {
      if (prev.timeSlots.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        timeSlots: prev.timeSlots.filter((slot) => slot.id !== slotId),
      };
    });
    setResult(null);
  }, []);

  const resetResult = useCallback(() => setResult(null), []);

  const generateSimulation = useCallback(() => {
    if (!mainCategory || !subCategory) {
      return null;
    }
    setIsLoading(true);
    return new Promise<KsunsSimulationResult>((resolve) => {
      window.setTimeout(() => {
        const simulation = simulateKsunsResult({
          mainCategory,
          subCategory,
          form,
        });
        setResult(simulation);
        setIsLoading(false);
        resolve(simulation);
      }, 800);
    });
  }, [form, mainCategory, subCategory]);

  const value = useMemo(
    () => ({
      mainCategory,
      subCategory,
      form,
      result,
      isLoading,
      selectMainCategory,
      selectSubCategory,
      updateFormField,
      updateTimeSlot,
      addTimeSlot,
      removeTimeSlot,
      generateSimulation,
      resetResult,
    }),
    [
      addTimeSlot,
      form,
      generateSimulation,
      isLoading,
      mainCategory,
      resetResult,
      removeTimeSlot,
      result,
      selectMainCategory,
      selectSubCategory,
      subCategory,
      updateFormField,
      updateTimeSlot,
    ],
  );

  return (
    <KsunsPlannerContext.Provider value={value}>
      {children}
    </KsunsPlannerContext.Provider>
  );
};

export const useKsunsPlanner = () => {
  const ctx = useContext(KsunsPlannerContext);
  if (!ctx) {
    throw new Error("useKsunsPlanner must be used within KsunsPlannerProvider");
  }
  return ctx;
};
