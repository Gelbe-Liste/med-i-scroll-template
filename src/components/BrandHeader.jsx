import { templateConfig } from "../data/content";

export default function BrandHeader() {
  return (
    <header className="brand-header">
      <div className="brand-lockup" aria-label="Gelbe Liste Pharmindex">
        <span className="brand-main">GELBE LISTE.</span>
        <span className="brand-sub">PHARMINDEX</span>
      </div>
      <div className="co-branding">
        <span>{templateConfig.product}</span>
        <span className="divider" />
        <span>{templateConfig.sponsor}</span>
      </div>
    </header>
  );
}
