import { KsunsFormData } from "@/lib/types";

export type KsunsFormErrors = {
  seats?: string;
  unitPrice?: string;
  timeSlots?: Record<string, string>;
};

const parseMinutes = (value: string) => {
  const [hours, minutes] = value.split(":");
  const h = Number(hours);
  const m = Number(minutes);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return null;
  }
  return h * 60 + m;
};

export const validateKsunsForm = (form: KsunsFormData): KsunsFormErrors => {
  const errors: KsunsFormErrors = {};
  if (form.seats === "" || Number.isNaN(form.seats)) {
    errors.seats = "座席数を入力してください（1〜200席）。";
  } else if (form.seats < 1 || form.seats > 200) {
    errors.seats = "座席数は 1〜200 の範囲で入力してください。";
  }

  if (form.unitPrice === "" || Number.isNaN(form.unitPrice)) {
    errors.unitPrice = "客単価を入力してください（1〜20,000 円）。";
  } else if (form.unitPrice < 1 || form.unitPrice > 20_000) {
    errors.unitPrice = "客単価は 1〜20,000 円の範囲で入力してください。";
  }

  const slotErrors: Record<string, string> = {};
  form.timeSlots.forEach((slot) => {
    if (!slot.start || !slot.end) {
      slotErrors[slot.id] = "開始・終了時刻を両方入力してください。";
      return;
    }
    const start = parseMinutes(slot.start);
    const end = parseMinutes(slot.end);
    if (start === null || end === null) {
      slotErrors[slot.id] = "有効な時間を入力してください。";
    } else if (end - start < 60) {
      slotErrors[slot.id] = "1 時間以上の営業枠を設定してください。";
    } else if (end <= start) {
      slotErrors[slot.id] = "終了時刻は開始時刻より後に設定してください。";
    }
  });
  if (Object.keys(slotErrors).length > 0) {
    errors.timeSlots = slotErrors;
  }

  return errors;
};

export const hasFormErrors = (errors: KsunsFormErrors) =>
  Boolean(
    errors.seats ||
      errors.unitPrice ||
      (errors.timeSlots && Object.keys(errors.timeSlots).length > 0),
  );
