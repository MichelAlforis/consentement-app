export const APP_VARIANT = (process.env.NEXT_PUBLIC_APP_VARIANT ?? 'main') as 'main' | 'adult';
export const isAdultApp = APP_VARIANT === 'adult';
