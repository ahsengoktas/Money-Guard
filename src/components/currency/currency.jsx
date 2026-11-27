import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrencyRates } from '../../redux/currency/currency-operations';
import {
  selectCurrencyError,
  selectCurrencyRates,
  selectCurrencyStatus,
} from '../../redux/currency/currency-selectors';
import css from './currency.module.css';

const CURRENCY_CODES = ['USD', 'EUR'];
const formatRate = (value) => (value == null ? '—' : value.toFixed(2));

// Figma's wave is decorative, not a historical exchange-rate chart.
function CurrencyWave({ rates }) {
  const gradientId = useId();
  return (
    <svg
      className={css.wave}
      viewBox="0 0 480 218"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--color-currency-wave-light)"
            stopOpacity="0.78"
          />
          <stop
            offset="100%"
            stopColor="var(--color-currency-wave-dark)"
            stopOpacity="0.20"
          />
        </linearGradient>
      </defs>
      <g className={css.compactWave}>
        <path
          d="M0 127 45 80 Q63 63 82 80 L163 169 Q183 190 205 170 L346 38 Q367 15 386 38 L419 78 Q438 94 458 78 Q470 65 480 70 V218 H0Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M0 115 45 68 Q63 51 82 68 L163 157 Q183 179 205 158 L346 26 Q367 3 386 26 L419 66 Q438 82 458 66 Q470 53 480 58"
          fill="none"
          stroke="var(--color-expense)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <g
          fill="var(--color-currency-wave-marker)"
          stroke="var(--color-expense)"
          strokeWidth="1.2"
        >
          <circle cx="63" cy="59.5" r="4" />
          <circle cx="367" cy="14.5" r="4" />
        </g>
      </g>
      <g className={css.desktopWave}>
        <path
          d="M0 110 42 81 Q62 67 82 80 L163 135 Q183 150 205 135 L346 46 Q367 32 386 46 L419 69 Q438 82 458 68 Q470 58 480 63 V218 H0Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M0 99 42 70 Q62 56 82 69 L163 124 Q183 139 205 124 L346 35 Q367 21 386 35 L419 58 Q438 71 458 57 Q470 47 480 52"
          fill="none"
          stroke="var(--color-expense)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
        <g
          fill="var(--color-currency-wave-marker)"
          stroke="var(--color-expense)"
          strokeWidth="1"
        >
          <circle cx="62" cy="63" r="4" />
          <circle cx="367" cy="28" r="4" />
        </g>
      </g>
      <g
        className={css.waveLabels}
        fill="var(--color-expense)"
        fontSize="12"
        textAnchor="middle"
      >
        {rates.map(({ code, buy }) => (
          <text
            key={code}
            x={code === 'USD' ? 62 : 367}
            y={code === 'USD' ? 49 : 14}
          >
            {formatRate(buy)}
          </text>
        ))}
      </g>
    </svg>
  );
}

export default function Currency() {
  const dispatch = useDispatch();
  const rates = useSelector(selectCurrencyRates);
  const status = useSelector(selectCurrencyStatus);
  const error = useSelector(selectCurrencyError);

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, [dispatch]);

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <section
      className={css.currency}
      aria-label="Exchange rates against UAH"
      aria-busy={isLoading}
    >
      <table className={css.table}>
        <thead>
          <tr>
            <th scope="col">Currency</th>
            <th scope="col">Purchase</th>
            <th scope="col">Sale</th>
          </tr>
        </thead>
        <tbody>
          {CURRENCY_CODES.map((code) => {
            const rate = rates.find((item) => item.code === code);
            return (
              <tr key={code}>
                <th scope="row">{code}</th>
                <td>{formatRate(rate?.buy)}</td>
                <td>{formatRate(rate?.sell)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isLoading && (
        <p className={css.message} role="status">
          Loading exchange rates…
        </p>
      )}
      {error && (
        <div className={css.message}>
          <p role="status">
            {error}
            {rates.length > 0 && ' Showing last saved rates.'}
          </p>
          <button
            type="button"
            className={css.retry}
            onClick={() => dispatch(fetchCurrencyRates())}
          >
            Retry
          </button>
        </div>
      )}
      <CurrencyWave rates={rates} />
    </section>
  );
}
