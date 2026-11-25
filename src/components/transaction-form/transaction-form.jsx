import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import css from './transaction-form.module.css';

const TRANSACTION_SCHEMA = yup.object({
  type: yup.string().oneOf(['INCOME', 'EXPENSE']).required(),
  amount: yup
    .number()
    .transform((_, originalValue) => {
      const amount = String(originalValue ?? '').trim();
      if (!amount) return undefined;
      return /^\d+(?:[.,]\d{1,2})?$/.test(amount)
        ? Number(amount.replace(',', '.'))
        : NaN;
    })
    .typeError('Enter a valid amount (up to 2 decimal places)')
    .moreThan(0, 'Amount must be greater than zero')
    .required('Enter an amount'),
  transactionDate: yup
    .date()
    .typeError('Choose a date')
    .required('Choose a date')
    .max(yup.ref('$today'), 'Date cannot be in the future'),
  categoryId: yup.string().when(['type', '$isEditMode'], {
    is: (type, isEditMode) => type === 'EXPENSE' && !isEditMode,
    then: (field) => field.required('Choose a category'),
    otherwise: (field) => field.notRequired(),
  }),
  comment: yup
    .string()
    .trim()
    .max(200, 'Maximum 200 characters')
    .default('')
    .when('$isEditMode', {
      is: false,
      then: (field) => field.required('Enter a comment'),
    }),
});

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isValidDateInput = (value, maxDate) => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) return false;
  const [, day, month, year] = match;
  const dateString = `${year}-${month}-${day}`;
  const date = new Date(`${dateString}T00:00:00`);
  return (
    !Number.isNaN(date.getTime()) &&
    toDateString(date) === dateString &&
    date <= maxDate
  );
};

function CategorySelect({ field, categories, disabled, invalid }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const options = useRef([]);
  const selectedIndex = categories.findIndex(({ id }) => id === field.value);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const focusOption = (index) => options.current[index]?.focus();
  const close = () => {
    setOpen(false);
    field.onBlur();
    trigger.current?.focus();
  };
  const choose = (id) => {
    field.onChange(id);
    close();
  };
  const openList = () => {
    if (!categories.length) return;
    setOpen(true);
  };

  useEffect(() => {
    if (open) options.current[Math.max(0, selectedIndex)]?.focus();
  }, [open, selectedIndex]);

  return (
    <div
      className={css.selectWrap}
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          field.onBlur();
        }
      }}
    >
      <button
        type="button"
        id="transaction-category"
        className={`${css.input} ${css.selectTrigger} ${selectedIndex < 0 ? css.placeholder : ''}`}
        ref={(element) => {
          trigger.current = element;
          field.ref(element);
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? 'transaction-categories' : undefined}
        aria-invalid={invalid}
        aria-describedby={invalid ? 'category-error' : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openList();
          }
        }}
      >
        {categories[selectedIndex]?.name ?? 'Select a category'}
        <span className={css.chevron} aria-hidden="true" />
      </button>
      {open && (
        <div
          id="transaction-categories"
          className={css.categoryList}
          role="listbox"
          aria-label="Expense categories"
        >
          {categories.map(({ id, name }, index) => (
            <button
              type="button"
              key={id}
              role="option"
              aria-selected={field.value === id}
              tabIndex={-1}
              ref={(element) => {
                options.current[index] = element;
              }}
              className={css.categoryOption}
              onClick={() => choose(id)}
              onKeyDown={(event) => {
                const targets = {
                  ArrowDown: (index + 1) % categories.length,
                  ArrowUp: (index - 1 + categories.length) % categories.length,
                  Home: 0,
                  End: categories.length - 1,
                };
                if (event.key === 'Escape') {
                  event.preventDefault();
                  event.stopPropagation();
                  close();
                } else if (event.key in targets) {
                  event.preventDefault();
                  focusOption(targets[event.key]);
                }
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TransactionForm({
  categories = [],
  initialTransaction,
  submitLabel,
  onSubmit,
  onCancel,
  busy = false,
}) {
  const [today] = useState(() => new Date());
  const isEditMode = Boolean(initialTransaction);
  const incomeCategory = categories.find(
    (category) => category.type === 'INCOME',
  );
  const expenseCategories = categories.filter(
    (category) => category.type === 'EXPENSE',
  );
  const {
    register,
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(TRANSACTION_SCHEMA),
    context: { isEditMode, today },
    defaultValues: {
      type: initialTransaction?.type ?? 'EXPENSE',
      categoryId: initialTransaction?.categoryId ?? '',
      transactionDate: initialTransaction?.transactionDate
        ? new Date(
            `${initialTransaction.transactionDate.slice(0, 10)}T00:00:00`,
          )
        : today,
      amount: initialTransaction
        ? Math.abs(Number(initialTransaction.amount))
        : '',
      comment: initialTransaction?.comment ?? '',
    },
  });
  const type = useWatch({ control, name: 'type' });
  const submitting = busy || isSubmitting;

  const handleTypeChange = (nextType) => {
    setValue('type', nextType);
    setValue(
      'categoryId',
      nextType === 'INCOME' ? (incomeCategory?.id ?? '') : '',
      { shouldValidate: nextType === 'INCOME' },
    );
    if (nextType === 'EXPENSE') clearErrors('categoryId');
  };

  const save = async (values) => {
    const payload = {
      transactionDate: toDateString(values.transactionDate),
      comment: values.comment.trim(),
      amount:
        values.type === 'EXPENSE'
          ? -Math.abs(values.amount)
          : Math.abs(values.amount),
    };
    if (!isEditMode) {
      const categoryId =
        values.type === 'INCOME' ? incomeCategory?.id : values.categoryId;
      if (!categoryId) {
        toast.error('Transaction category is unavailable');
        return;
      }
      Object.assign(payload, { type: values.type, categoryId });
    }
    try {
      await onSubmit(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <form
      className={css.form}
      onSubmit={handleSubmit(save)}
      noValidate
      autoComplete="off"
    >
      {isEditMode && (
        <div
          className={`${css.typeSwitch} ${css.editType}`}
          role="group"
          aria-label={`Transaction type: ${type === 'INCOME' ? 'Income' : 'Expense'} (read only)`}
        >
          <span
            className={type === 'INCOME' ? css.activeIncome : css.typeLabel}
          >
            Income
          </span>
          <span className={css.editTypeDivider} aria-hidden="true">
            /
          </span>
          <span
            className={type === 'EXPENSE' ? css.activeExpense : css.typeLabel}
          >
            Expense
          </span>
        </div>
      )}
      {isEditMode && type === 'EXPENSE' && (
        <div className={`${css.input} ${css.categoryDisplay}`}>
          <span className={css.srOnly}>Category (read only): </span>
          {categories.find(({ id }) => id === initialTransaction.categoryId)
            ?.name ?? '—'}
        </div>
      )}
      {!isEditMode && (
        <fieldset className={css.typeSwitch} disabled={submitting}>
          <legend className={css.srOnly}>Transaction type</legend>
          <label
            className={type === 'INCOME' ? css.activeIncome : css.typeLabel}
          >
            <input
              className={css.srOnly}
              name="transaction-type"
              type="radio"
              checked={type === 'INCOME'}
              onChange={() => handleTypeChange('INCOME')}
            />
            Income
          </label>
          <button
            type="button"
            className={`${css.switchTrack} ${type === 'INCOME' ? css.incomeTrack : css.expenseTrack}`}
            aria-label="Switch transaction type"
            onClick={() =>
              handleTypeChange(type === 'INCOME' ? 'EXPENSE' : 'INCOME')
            }
          >
            <span className={css.switchThumb} aria-hidden="true">
              {type === 'INCOME' ? '+' : '−'}
            </span>
          </button>
          <label
            className={type === 'EXPENSE' ? css.activeExpense : css.typeLabel}
          >
            <input
              className={css.srOnly}
              name="transaction-type"
              type="radio"
              checked={type === 'EXPENSE'}
              onChange={() => handleTypeChange('EXPENSE')}
            />
            Expense
          </label>
        </fieldset>
      )}
      {!isEditMode && type === 'EXPENSE' && (
        <div className={css.field}>
          <label className={css.srOnly} htmlFor="transaction-category">
            Category
          </label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategorySelect
                field={field}
                categories={expenseCategories}
                disabled={submitting}
                invalid={Boolean(errors.categoryId)}
              />
            )}
          />
          {errors.categoryId && (
            <p id="category-error" className={css.error}>
              {errors.categoryId.message}
            </p>
          )}
        </div>
      )}
      <div className={css.amountDate}>
        <div className={css.field}>
          <label className={css.srOnly} htmlFor="transaction-amount">
            Sum
          </label>
          <input
            className={`${css.input} ${css.amount}`}
            id="transaction-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            disabled={submitting}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
            {...register('amount')}
          />
          {errors.amount && (
            <p id="amount-error" className={css.error}>
              {errors.amount.message}
            </p>
          )}
        </div>
        <div className={css.field}>
          <label className={css.srOnly} htmlFor="transaction-date">
            Date
          </label>
          <Controller
            name="transactionDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="transaction-date"
                className={`${css.input} ${css.dateInput}`}
                wrapperClassName={css.dateWrapper}
                selected={field.value}
                onChange={field.onChange}
                onChangeRaw={(event) => {
                  if (
                    event?.target instanceof HTMLInputElement &&
                    !isValidDateInput(event.target.value, today)
                  ) {
                    field.onChange(null);
                  }
                }}
                onBlur={field.onBlur}
                strictParsing
                dateFormat="dd.MM.yyyy"
                maxDate={today}
                disabled={submitting}
                showIcon
                icon={
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect
                      x="4"
                      y="5"
                      width="16"
                      height="16"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 10h16M8 3v4m8-4v4M8 13h2m4 0h2m-8 4h2m4 0h2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                }
                toggleCalendarOnIconClick
                ariaInvalid={errors.transactionDate ? 'true' : undefined}
                ariaDescribedBy={
                  errors.transactionDate ? 'date-error' : undefined
                }
              />
            )}
          />
          {errors.transactionDate && (
            <p id="date-error" className={css.error}>
              {errors.transactionDate.message}
            </p>
          )}
        </div>
      </div>
      <div className={css.field}>
        <label className={css.srOnly} htmlFor="transaction-comment">
          Comment
        </label>
        <textarea
          className={`${css.input} ${css.comment}`}
          id="transaction-comment"
          rows={1}
          placeholder="Comment"
          disabled={submitting}
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? 'comment-error' : undefined}
          {...register('comment')}
        />
        {errors.comment && (
          <p id="comment-error" className={css.error}>
            {errors.comment.message}
          </p>
        )}
      </div>
      <div className={css.actions}>
        <button className={css.submit} type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          className={css.cancel}
          type="button"
          disabled={submitting}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
