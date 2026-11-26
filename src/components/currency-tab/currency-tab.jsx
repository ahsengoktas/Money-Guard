import Currency from '../currency/currency';
import css from './currency-tab.module.css';

export default function CurrencyTab() {
  return (
    <div className={css.tab}>
      <Currency />
    </div>
  );
}
