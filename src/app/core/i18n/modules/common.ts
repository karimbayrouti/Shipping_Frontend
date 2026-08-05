export const COMMON_EN = {
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    view: 'View',
    edit: 'Edit',
  },
} as const;

export interface CommonTranslations {
  actions: Record<keyof typeof COMMON_EN.actions, string>;
}

export type CommonActionTranslations = CommonTranslations['actions'];

export const COMMON_AR: CommonTranslations = {
  actions: {
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    view: 'عرض',
    edit: 'تعديل',
  },
};
