import styles from "./steps.module.css";

export function Steps({ children }: { children: React.ReactNode }) {
  return <div className={styles.steps}>{children}</div>;
}
