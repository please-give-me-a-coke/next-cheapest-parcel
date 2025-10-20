import styles from './footer.module.css';
import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className={styles.footer}>
          <a href="https://github.com/please-give-me-a-coke/cheapest-parcel" target="_blank">API GitHub</a> |{' '}
          <a href="https://github.com/please-give-me-a-coke/next-cheapest-parcel" target="_blank">Web GitHub</a> |{' '}
          <a href="https://api.cheapest-parcel.dedyn.io/parcels-prices/cheapest?type=DOMESTIC&region=OTHER_AREA&weight=1000&continue" target="_blank">API</a> |{' '}
          <a href="mailto:pleasegivemeacok@gmail.com">Contact</a>
      </footer>
    </div>
  );
}
