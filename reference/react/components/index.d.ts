// Documentation of the OpenPractice bundle's props; not type-checked.
// Change events: every form control's onChange receives the new VALUE first (a string, boolean, number, Date or array),
// and for native inputs the DOM event second. In Vue this is v-model plus an optional "change" event.
export type IconName = "eye" | "eye-slash" | "arrow-left" | "menu" | "sign-out" | "eraser" | "card" | "receipt" | "signature" | "form" | "download" | "print" | "lock" | "pin" | "edit" | "mail" | "phone" | "wallet" | "bell" | "shield" | "trash" | "arrow-up" | "arrow-down" | "sort" | "minus" | "filter" | "search" | "check" | "x" | "alert" | "info" | "user" | "plus" | "file" | "clock" | "chevron-down" | "chevron-right" | "chevron-left" | "upload" | "calendar" | "home";
export type Tone = "success" | "info" | "warning" | "danger";
export type StampStatus = "paid" | "due" | "overdue" | "action" | "scheduled" | "confirmed" | "cancelled" | "signed" | "pending" | "complete";
export type Gap = number | string;
export interface OpenPracticeConfig { locale?: string; currency?: string; dir?: "ltr" | "rtl" | null; messages?: Record<string, string> }
// configure(opts) sets the locale (month and weekday names, week start, date order, number format), the currency, the text direction and any message overrides. useToast() returns { show, dismiss, clear }. US_STATES is the default region list.

// ---- Primitives ----
export interface IconProps { name: IconName; small?: boolean; bold?: boolean }
export interface ButtonProps { variant?: "primary" | "secondary" | "outline" | "danger" | "quiet"; block?: boolean; disabled?: boolean; icon?: IconName; type?: "button" | "submit"; onClick?: () => void; children: React.ReactNode }
export interface IconButtonProps { icon: IconName; label: string; onClick?: () => void; disabled?: boolean }
export interface ChipProps { tone?: "neutral" | Tone; children: React.ReactNode }
export interface LinkProps { href: string; external?: boolean; children: React.ReactNode }
export interface SpinnerProps { label?: string; block?: boolean }
export interface AvatarProps { name: string; src?: string; small?: boolean; large?: boolean }
export interface ProgressProps { label: string; value: number; max?: number; valueText?: string }
export interface LoadingBarProps { label?: string }
export interface SkeletonProps { height?: number | string; width?: number | string; circle?: boolean }
export interface StatusStampProps { status?: StampStatus; tone?: Tone; label?: string; icon?: IconName; detail?: string; small?: boolean }
export interface HeadingProps { level?: 1 | 2 | 3; kicker?: string; children: React.ReactNode }
export interface TextProps { variant?: "body" | "deck" | "small"; muted?: boolean; as?: string; children: React.ReactNode }
export interface DividerProps { label?: string }

// ---- Building blocks ----
export interface SurfaceProps { as?: string; pad?: "sm" | "md" | "lg"; clip?: boolean; actions?: React.ReactNode; tone?: "default" | "tint" | "float"; className?: string; id?: string; role?: string; children?: React.ReactNode }
export interface StackProps { as?: string; gap?: Gap; align?: "center" | "end"; className?: string; children?: React.ReactNode }
export interface InlineProps { as?: string; gap?: Gap; justify?: "between" | "end"; align?: "start" | "baseline"; nowrap?: boolean; className?: string; children?: React.ReactNode }
export interface GridProps { as?: string; min?: string; gap?: Gap; className?: string; children?: React.ReactNode }
export interface ActionsProps { as?: string; bar?: boolean; className?: string; children?: React.ReactNode }
export interface MetaListProps { items: ({ icon?: IconName; text: React.ReactNode } | null)[]; className?: string }
export interface DescriptionListProps { items: { label: string; text: React.ReactNode }[]; className?: string }
export interface KickerProps { as?: string; children: React.ReactNode }
export interface VisuallyHiddenProps { as?: string; children: React.ReactNode }

// ---- Form controls ----
export interface InputAttributes { name?: string; autoComplete?: string; autoCapitalize?: string; maxLength?: number; minLength?: number; pattern?: string; inputMode?: string; spellCheck?: boolean; readOnly?: boolean; enterKeyHint?: string; autoFocus?: boolean; inputRef?: React.Ref<HTMLInputElement>; onBlur?: () => void; onFocus?: () => void; onKeyDown?: (e: React.KeyboardEvent) => void }
export interface FieldProps extends InputAttributes { label: string; hideLabel?: boolean; hint?: string; error?: string; placeholder?: string; type?: string; value?: string; defaultValue?: string; prefix?: string; suffix?: string; required?: boolean; optional?: boolean; disabled?: boolean; id?: string; onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void }
export interface FormFieldProps { label: string; hint?: string; error?: string; required?: boolean; optional?: boolean; id?: string; children: React.ReactNode | ((a: { id: string; "aria-invalid"?: "true"; "aria-describedby"?: string }) => React.ReactNode) }
export interface FieldsetProps { legend?: string; bare?: boolean; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean; className?: string; legendClassName?: string; id?: string; children: React.ReactNode }
export interface TextareaProps extends InputAttributes { label: string; hint?: string; error?: string; placeholder?: string; rows?: number; value?: string; defaultValue?: string; required?: boolean; optional?: boolean; disabled?: boolean; id?: string; onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void }
export interface OptionItem { value: string; label: string; description?: string; icon?: IconName; group?: string; disabled?: boolean }
export interface SelectProps { label?: string; hideLabel?: boolean; options: (string | OptionItem)[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; placeholder?: string; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean; name?: string; bare?: boolean; ariaLabel?: string; id?: string }
export interface ComboboxProps extends InputAttributes { label: string; options: (string | OptionItem)[]; value?: string | string[]; defaultValue?: string | string[]; onChange?: (value: any) => void; onInputChange?: (text: string) => void; loading?: boolean; emptyText?: string; placeholder?: string; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean; clearable?: boolean; filter?: (option: OptionItem, query: string) => boolean; freeText?: boolean; multiple?: boolean; noToggle?: boolean; id?: string }
export interface AutocompleteProps extends ComboboxProps {}
export interface MultiSelectProps extends ComboboxProps { value?: string[]; defaultValue?: string[]; onChange?: (values: string[]) => void }
export interface CheckboxProps { label: string; description?: string; checked?: boolean; defaultChecked?: boolean; indeterminate?: boolean; bare?: boolean; disabled?: boolean; required?: boolean; error?: string; name?: string; value?: string; id?: string; inputRef?: React.Ref<HTMLInputElement>; onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void }
export interface RadioGroupProps { label: string; options: (string | { value: string; label: string; description?: string; disabled?: boolean; reveal?: React.ReactNode })[]; value?: string; defaultValue?: string; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean; name?: string; onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void }
export interface SwitchProps { label: string; description?: string; checked?: boolean; defaultChecked?: boolean; disabled?: boolean; name?: string; value?: string; id?: string; inputRef?: React.Ref<HTMLInputElement>; onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void }
export interface NumberFieldProps { label: string; hideLabel?: boolean; value?: number | ""; defaultValue?: number; onChange?: (n: number | null) => void; min?: number; max?: number; step?: number; prefix?: string; suffix?: string; name?: string; autoComplete?: string; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean; id?: string }
export interface SegmentedControlProps { label: string; options: (string | { value: string; label: string; icon?: IconName; disabled?: boolean })[]; value?: string; defaultValue?: string; hint?: string; error?: string; disabled?: boolean; name?: string; onChange?: (v: string) => void }
export interface SearchBarProps { placeholder?: string; label?: string; action?: string; name?: string; value?: string; defaultValue?: string; disabled?: boolean; onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void; onSubmit?: (value: string) => void }
export interface FileUploadProps { label: string; accept?: string; multiple?: boolean; name?: string; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean; onFiles?: (files: File[]) => void }
export interface OtpFieldProps { label?: string; length?: number; type?: "numeric" | "text"; groupSize?: number; name?: string; value?: string; defaultValue?: string; autoFocus?: boolean; onChange?: (code: string) => void; onComplete?: (code: string) => void; hint?: string; error?: string; disabled?: boolean; id?: string }
export interface CalendarProps { disabledDate?: (d: Date) => boolean; marked?: Date[] | ((d: Date) => boolean); markLabel?: string; value?: Date | null; onChange?: (d: Date) => void; mode?: "single" | "range"; start?: Date | null; end?: Date | null; onRangeChange?: (r: { start: Date | null; end: Date | null }) => void; min?: Date; max?: Date; month?: Date; footer?: boolean; onClear?: () => void }
export interface DatePickerProps { label: string; value?: Date | null; defaultValue?: Date | null; onChange?: (d: Date | null) => void; min?: Date; max?: Date; name?: string; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean }
export interface DateRangePickerProps { label: string; value?: { start: Date | null; end: Date | null }; defaultValue?: { start: Date | null; end: Date | null }; onChange?: (r: { start: Date | null; end: Date | null }) => void; min?: Date; max?: Date; startName?: string; endName?: string; presets?: { label: string; get: () => { start: Date; end: Date } }[]; hint?: string; error?: string; required?: boolean; optional?: boolean; disabled?: boolean }
export interface TimeSlotsProps { label: string; slots: (string | { value: string; label: string; disabled?: boolean })[]; value?: string | null; defaultValue?: string; onChange?: (value: string) => void; emptyText?: string; name?: string; hint?: string; error?: string; required?: boolean; disabled?: boolean }
export interface PasswordFieldProps extends FieldProps { mode?: "current" | "new"; rules?: { label: string; test: (value: string) => boolean }[] }
export interface PhoneFieldProps extends FieldProps { format?: "us" | "none" }
export interface CurrencyFieldProps extends NumberFieldProps { currency?: string; locale?: string }
export interface Address { street?: string; unit?: string; city?: string; region?: string; postal?: string }
export interface AddressFieldsProps { legend?: string; value?: Address; defaultValue?: Address; onChange?: (a: Address) => void; errors?: Address; regions?: OptionItem[]; name?: string; disabled?: boolean }
export interface PaymentCardFieldProps { label?: string; state?: "loading" | "ready" | "error"; error?: string; note?: string; required?: boolean; mountId?: string; mountRef?: React.Ref<HTMLDivElement>; id?: string; children?: React.ReactNode }
export interface SignaturePadProps { height?: number; disabled?: boolean; onChange?: (v: { empty: boolean; image: string }) => void }
export interface SignatureFieldProps { label?: string; mode?: "type" | "draw" | "both"; defaultName?: string; agreement?: string; date?: Date; onChange?: (v: { method: "type" | "draw"; name: string; image: string; agreed: boolean }) => void }
export interface FormSectionProps { title: string; description?: string; headingLevel?: 1 | 2 | 3 | 4; gap?: Gap; children: React.ReactNode }
export interface ErrorSummaryProps { errors: { field?: string; message: string }[]; title?: string; headingLevel?: 1 | 2 | 3 | 4; autoFocus?: boolean }

// ---- The account ----
export interface AmountFigureProps { amount: number; label?: string; currency?: string; locale?: string; details?: { label: string; value: number | string }[] }
export interface ActivityItem { kind: "you" | "practice" | "system"; note: string; source: string }
export interface ActivityListProps { items: ActivityItem[] }
export interface StatementCardProps extends StatusStampProps, AmountFigureProps { title: string; subtitle?: string; amountLabel?: string; reason?: string; parts?: { label: string; text: string }[]; activity?: ActivityItem[]; activityTitle?: string; headingLevel?: 1 | 2 | 3 | 4; actions?: React.ReactNode }
export interface StatementRowProps extends StatementCardProps {}
export interface DetailRowProps { label: string; status?: string; tone?: Tone; onEdit?: () => void; children: React.ReactNode }
export interface ItemRowProps extends StatusStampProps { title: string; subtitle?: string; icon?: IconName; action?: React.ReactNode }
export interface ItemListProps { children: React.ReactNode }
export interface Provider { name: string; role?: string; photo?: string }
export interface AppointmentCardProps { date: Date; time: string; title: string; subtitle?: string; provider?: Provider; with?: string; role?: string; photo?: string; location?: string; status?: StampStatus; tone?: Tone; label?: string; headingLevel?: 1 | 2 | 3 | 4; actions?: React.ReactNode }

// ---- Feedback and overlays ----
export interface NoticeProps { title: string; headingLevel?: 1 | 2 | 3 | 4 | 5 | 6; titleId?: string; role?: string | false; tone?: Tone; icon?: IconName; actions?: React.ReactNode; action?: React.ReactNode; onDismiss?: () => void; className?: string; children?: React.ReactNode }
export interface ToastProps { title: string; tone?: Tone; icon?: IconName; action?: React.ReactNode; onClose?: () => void; children?: React.ReactNode }
export interface ToastProviderProps { children: React.ReactNode }
export interface TooltipProps { label: string; children: React.ReactElement }
export interface PopoverProps { label: string; trigger: React.ReactNode; title?: string; headingLevel?: 1 | 2 | 3 | 4; actions?: React.ReactNode; className?: string; children: React.ReactNode }
export interface DialogProps { open: boolean; title: string; headingLevel?: 1 | 2 | 3 | 4; onClose: () => void; actions?: React.ReactNode; inline?: boolean; children: React.ReactNode }
export interface DrawerProps { open: boolean; title: string; headingLevel?: 1 | 2 | 3 | 4; onClose: () => void; actions?: React.ReactNode; side?: "right" | "left"; inline?: boolean; children: React.ReactNode }
export interface MenuProps { label: string; items: ({ label: string; icon?: IconName; onClick?: () => void; danger?: boolean; disabled?: boolean } | { divider: true })[]; variant?: "outline" | "primary" | "secondary"; icon?: IconName }
export interface EmptyStateProps { icon?: IconName; title: string; headingLevel?: 1 | 2 | 3 | 4; action?: React.ReactNode; bare?: boolean; children?: React.ReactNode }

// ---- Layout and display ----
export interface PanelProps { kicker?: string; title?: string; headingLevel?: 1 | 2 | 3 | 4; action?: React.ReactNode; children: React.ReactNode }
export interface DisclosureProps { title: string; meta?: string; variant?: "row" | "card"; defaultOpen?: boolean; group?: string; children: React.ReactNode }
export interface AccordionProps { items: { id: string; title: string; meta?: string; content: React.ReactNode; defaultOpen?: boolean }[]; multiple?: boolean }
export interface TabsProps { items: { id: string; label: string; count?: number; content?: React.ReactNode }[]; value?: string; defaultValue?: string; onChange?: (id: string) => void }
export interface DataGridColumn { key: string; label: string; sortable?: boolean; numeric?: boolean; align?: "center"; width?: number | string; minWidth?: number; resizable?: boolean; render?: (row: any) => React.ReactNode; value?: (row: any) => string | number | Date; filter?: { type: "text" | "select" | "number"; options?: (string | { value: string; label: string })[] } }
export interface QueryState { sort: { key: string; dir: "asc" | "desc" } | null; page: number; pageSize: number; search: string; filters: Record<string, any> }
export interface DataGridProps { columns: DataGridColumn[]; rows: ({ id: string | number } & Record<string, any>)[]; caption?: string; searchable?: boolean; searchPlaceholder?: string; filterable?: boolean; resizable?: boolean; stickyFirst?: boolean; columnToggle?: boolean; selectable?: boolean; onSelectionChange?: (ids: string[]) => void; bulkActions?: React.ReactNode; toolbar?: React.ReactNode; pageSize?: number; defaultSort?: { key: string; dir: "asc" | "desc" }; maxHeight?: string; virtual?: boolean | { rowHeight?: number; height?: number; overscan?: number }; cards?: boolean; manual?: boolean; total?: number; onQueryChange?: (q: QueryState) => void; loading?: boolean; emptyTitle?: string; emptyText?: string; emptyIcon?: IconName; plain?: boolean }

// ---- Navigation and the page ----
export interface BreadcrumbProps { items: { label: string; href?: string }[] }
export interface PaginationProps { page: number; pageCount: number; onChange?: (page: number) => void }
export interface NavListProps { items: { label: string; href?: string; icon?: IconName; count?: number; current?: boolean }[]; label?: string }
export interface StepperProps { steps: { label: string; state: "done" | "current" | "todo" }[]; label?: string }
export interface SkipLinkProps { href?: string; children?: React.ReactNode }
export interface AppHeaderProps { logo?: React.ReactNode; actions?: React.ReactNode; sticky?: boolean; children?: React.ReactNode }
export interface AppFooterProps { children?: React.ReactNode }
export interface AppShellProps { header?: React.ReactNode; sidebar?: React.ReactNode; sidebarLabel?: string; footer?: React.ReactNode; mainId?: string; children?: React.ReactNode }
export interface PageHeaderProps { title: string; description?: string; breadcrumb?: React.ReactNode; status?: React.ReactNode; actions?: React.ReactNode; headingLevel?: 1 | 2 | 3 | 4 }
export interface BackLinkProps { href?: string; onClick?: () => void; children?: React.ReactNode }
export interface ButtonGroupProps { label: string; children: React.ReactNode }
export interface ToggleButtonProps { icon?: IconName; pressed?: boolean; defaultPressed?: boolean; disabled?: boolean; onChange?: (pressed: boolean) => void; children: React.ReactNode }
