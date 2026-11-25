import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import css from './transaction-form.module.css';

// Capture today's date outside render to keep the component pure.
const today = new Date();

const schema = yup.object({
  type: yup.string().oneOf(['INCOME', 'EXPENSE']).required(),
  amount: yup
    .number()
    .typeError('Enter a valid amount')
    .moreThan(0, 'Amount must be greater than zero')
    .required(),
  transactionDate: yup
    .date()
    .typeError('Choose a date')
    .required('Choose a date'),
  categoryId: yup.string().required('Choose a category'),
  comment: yup.string().max(200, 'Maximum 200 characters').default(''),
});

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TransactionForm({
  categories,
  initialTransaction,
  submitLabel,
  onSubmit,
  onCancel,
  busy = false,
}) {
  const [requestError, setRequestError] = useState('');
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: initialTransaction?.type ?? 'EXPENSE',
      categoryId: initialTransaction?.categoryId ?? '',
      transactionDate: initialTransaction?.transactionDate
        ? new Date(initialTransaction.transactionDate)
        : today,
      amount: initialTransaction
        ? Math.abs(Number(initialTransaction.amount))
        : '',
      comment: initialTransaction?.comment ?? '',
    },
  });
  const type = useWatch({ control, name: 'type' });
  const availableCategories = categories.filter(
    (category) => category.type === type,
  );
  const submitting = busy || isSubmitting;

  const save = async (values) => {
    setRequestError('');
    const payload = {
      transactionDate: toDateString(values.transactionDate),
      type: values.type,
      categoryId: values.categoryId,
      comment: values.comment.trim(),
      amount:
        values.type === 'EXPENSE'
          ? -Math.abs(values.amount)
          : Math.abs(values.amount),
    };
    try {
      await onSubmit(payload);
    } catch (error) {
      setRequestError(String(error));
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit(save)} noValidate>
      <div className={css.typeSwitch}>
        <label className={type === 'INCOME' ? css.activeIncome : ''}>
          <input
            type="radio"
            value="INCOME"
            checked={type === 'INCOME'}
            onChange={() => {
              setValue('type', 'INCOME', { shouldValidate: true });
              setValue('categoryId', '', { shouldValidate: true });
            }}
            disabled={submitting}
          />
          Income
        </label>
        <span>/</span>
        <label className={type === 'EXPENSE' ? css.activeExpense : ''}>
          <input
            type="radio"
            value="EXPENSE"
            checked={type === 'EXPENSE'}
            onChange={() => {
              setValue('type', 'EXPENSE', { shouldValidate: true });
              setValue('categoryId', '', { shouldValidate: true });
            }}
            disabled={submitting}
          />
          Expense
        </label>
      </div>

      <label className={css.label} htmlFor="transaction-amount">
        Amount
      </label>
      <input
        className={css.input}
        id="transaction-amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        disabled={submitting}
        {...register('amount')}
      />
      {errors.amount && <p className={css.error}>{errors.amount.message}</p>}

      <label className={css.label} htmlFor="transaction-date">
        Date
      </label>
      <Controller
        name="transactionDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            id="transaction-date"
            className={css.input}
            wrapperClassName={css.dateWrapper}
            selected={field.value}
            onChange={field.onChange}
            dateFormat="dd.MM.yyyy"
            maxDate={today}
            disabled={submitting}
          />
        )}
      />
      {errors.transactionDate && (
        <p className={css.error}>{errors.transactionDate.message}</p>
      )}

      <label className={css.label} htmlFor="transaction-category">
        Category
      </label>
      <select
        className={css.input}
        id="transaction-category"
        disabled={submitting}
        {...register('categoryId')}
      >
        <option value="">Select category</option>
        {availableCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {errors.categoryId && (
        <p className={css.error}>{errors.categoryId.message}</p>
      )}

      <label className={css.label} htmlFor="transaction-comment">
        Comment
      </label>
      <textarea
        className={css.input}
        id="transaction-comment"
        rows={2}
        placeholder="Comment"
        disabled={submitting}
        {...register('comment')}
      />
      {errors.comment && <p className={css.error}>{errors.comment.message}</p>}

      {requestError && (
        <p role="alert" className={css.error}>
          {requestError}
        </p>
      )}
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
    </form>
  );
}
