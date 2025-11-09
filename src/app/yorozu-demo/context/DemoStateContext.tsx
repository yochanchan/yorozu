"use client";

import { createContext, useContext, useMemo, useState } from "react";

import {
  nationalRealtimeStats as nationalRealtimeSeed,
  prefectureRealtimeStats,
} from "@/lib/mockData/realtimeStats";
import { DemoCounters, PrefectureRealtimeStat } from "@/lib/types";

type DemoStateContextValue = {
  counters: DemoCounters;
  realtimePrefStats: Record<string, PrefectureRealtimeStat>;
  nationalRealtime: PrefectureRealtimeStat;
  registerConsultation: (prefCode: string) => void;
  registerTransfer: (prefCode: string) => void;
  getConsultationDelta: (prefCode: string) => number;
  getTransferDelta: (prefCode: string) => number;
};

const DemoStateContext = createContext<DemoStateContextValue | undefined>(
  undefined,
);

const initialCounters: DemoCounters = {
  consultations: {},
  transfers: {},
};

export const DemoStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [counters, setCounters] = useState<DemoCounters>(initialCounters);
  const [realtimePrefStats, setRealtimePrefStats] = useState(
    prefectureRealtimeStats,
  );
  const [nationalRealtime, setNationalRealtime] = useState(
    nationalRealtimeSeed,
  );

  const registerConsultation = (prefCode: string) => {
    setCounters((prev) => ({
      ...prev,
      consultations: {
        ...prev.consultations,
        [prefCode]: (prev.consultations[prefCode] ?? 0) + 1,
        ALL: (prev.consultations.ALL ?? 0) + 1,
      },
    }));
    setRealtimePrefStats((prev) => ({
      ...prev,
      [prefCode]: {
        todayConsultations: prev[prefCode].todayConsultations + 1,
        monthConsultations: prev[prefCode].monthConsultations + 1,
      },
    }));
    setNationalRealtime((prev) => ({
      todayConsultations: prev.todayConsultations + 1,
      monthConsultations: prev.monthConsultations + 1,
    }));
  };

  const registerTransfer = (prefCode: string) => {
    setCounters((prev) => ({
      ...prev,
      transfers: {
        ...prev.transfers,
        [prefCode]: (prev.transfers[prefCode] ?? 0) + 1,
        ALL: (prev.transfers.ALL ?? 0) + 1,
      },
    }));
  };

  const value = useMemo(
    () => ({
      counters,
      realtimePrefStats,
      nationalRealtime,
      registerConsultation,
      registerTransfer,
      getConsultationDelta: (prefCode: string) =>
        counters.consultations[prefCode] ?? 0,
      getTransferDelta: (prefCode: string) =>
        counters.transfers[prefCode] ?? 0,
    }),
    [counters, nationalRealtime, realtimePrefStats],
  );

  return (
    <DemoStateContext.Provider value={value}>
      {children}
    </DemoStateContext.Provider>
  );
};

export const useDemoState = () => {
  const ctx = useContext(DemoStateContext);
  if (!ctx) {
    throw new Error("useDemoState must be used inside DemoStateProvider");
  }
  return ctx;
};
