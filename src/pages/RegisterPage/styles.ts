export const styles = {
  root: {
    minHeight: "100vh", display: "grid", placeItems: "center", p: { xs: 2, sm: 3 },
    background: (theme: any) => `radial-gradient(circle at 12% 8%, ${theme.palette.primary.main}20 0, transparent 28rem), radial-gradient(circle at 90% 92%, ${theme.palette.secondary.main}18 0, transparent 24rem), ${theme.palette.background.default}`,
  },
  card: {
    width: "100%", maxWidth: 520, p: { xs: 3, sm: 5 }, border: "1px solid", borderColor: "divider", borderRadius: 4,
    boxShadow: (theme: any) => theme.palette.mode === "dark" ? "0 24px 64px rgba(0, 0, 0, 0.32)" : "0 24px 64px rgba(15, 23, 42, 0.12)",
  },
  brandRow: { display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 1.25, mb: 3.25 },
  brandMark: { width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 2.5, color: "primary.contrastText", bgcolor: "primary.main", boxShadow: "0 8px 18px rgba(37, 99, 235, 0.25)" },
  form: { display: "grid", gap: 2.25, mt: 3 },
  nameRow: { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 },
  submit: { minHeight: 46, mt: 0.5, fontWeight: 600 },
  footer: { textAlign: "center", color: "text.secondary", mt: 3 },
};
