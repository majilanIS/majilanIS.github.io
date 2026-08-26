import { useState } from "react";

const CERTIFICATES = [
    {
		title: "KAIM - Program Detail",
		file: new URL("../assets/certificates/KAIM - Program Detail.pdf", import.meta.url).href,
    },
    {
        title: "KAIM-Certificate",
        file: new URL("../assets/certificates/KAIM-Certificate.pdf", import.meta.url).href,
    },
    {
        title: "RAG Program",
        file: new URL("../assets/certificates/rag-program.pdf", import.meta.url).href,
    },
{
		title: "AI certificate on Udacity",
		file: new URL("../assets/certificates/AI certificate on Udacity.pdf", import.meta.url).href,
	},
	{
		title: "Fundamental for Programming Certificate of Udacity",
		file: new URL("../assets/certificates/Fundamental for Programming Certificate of Udacity.pdf", import.meta.url).href,
	},
	{
		title: "Certificate of appreciation",
		file: new URL("../assets/certificates/Certificate_of_appreciation.pdf", import.meta.url).href,
	},
	{
		title: "Certificate Printed",
		file: new URL("../assets/certificates/CertificatePrinted.pdf", import.meta.url).href,
	},
	{
		title: "FreeCodeCamp",
		file: new URL("../assets/certificates/FreeCodeCamp.pdf", import.meta.url).href,
	},
];

export default function Certificate({ theme = "dark" }) {
	const [showCertificates, setShowCertificates] = useState(false);

	const colors = {
		dark: {
			bg: "#111111",
			card: "#191919",
			text: "#F2F2F2",
			muted: "#9A9A9A",
			accent: "#FF6B1A",
			border: "rgba(255,255,255,0.08)",
			borderAccent: "rgba(255,107,26,0.35)",
			pill: "rgba(255,107,26,0.12)",
		},
		light: {
			bg: "#F5F2EE",
			card: "#FFFFFF",
			text: "#1A1A1A",
			muted: "#666666",
			accent: "#E85D04",
			border: "rgba(0,0,0,0.08)",
			borderAccent: "rgba(232,93,4,0.28)",
			pill: "rgba(232,93,4,0.10)",
		},
	}[theme] || colors.dark;

	return (
		<section
			id="certificates"
			style={{
				background: colors.bg,
				color: colors.text,
				padding: "60px clamp(20px, 4vw, 56px)",
				width: "100%",
			}}
		>
			<style>{`
				@media (max-width: 860px) {
					#certificates {
						width: 100% !important;
						padding: 44px 20px !important;
					}

					#certificates .certificate-grid {
						grid-template-columns: 1fr !important;
					}
				}

				@media (max-width: 560px) {
					#certificates .certificate-preview {
						height: 220px !important;
					}
				}
			`}</style>

			<div style={{ width: "100%", margin: 0 }}>
				<div style={{ marginBottom: 24 }}>
					<p
						style={{
							fontSize: 13,
							color: colors.accent,
							fontWeight: 700,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							marginBottom: 8,
						}}
					>
						Certificates
					</p>
					<h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: 0, lineHeight: 1.1 }}>
						My certificates
					</h2>
					<div style={{ width: 44, height: 3, borderRadius: 999, background: colors.accent, marginTop: 12 }} />
				</div>

				<button
					type="button"
					onClick={() => setShowCertificates((value) => !value)}
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 10,
						padding: "12px 18px",
						borderRadius: 999,
						border: `1px solid ${colors.borderAccent}`,
						background: colors.pill,
						color: colors.text,
						fontWeight: 700,
						cursor: "pointer",
						transition: "transform 0.2s ease, background 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-1px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)";
					}}
				>
					{showCertificates ? "Hide certificates" : "Show certificates"}
					<span style={{ color: colors.accent }}>↗</span>
				</button>

				<div
					style={{
						marginTop: showCertificates ? 28 : 0,
						maxHeight: showCertificates ? 1200 : 0,
						opacity: showCertificates ? 1 : 0,
						overflow: "hidden",
						transition: "all 0.35s ease",
					}}
				>
					<div
						className="certificate-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
							gap: 18,
						}}
					>
						{CERTIFICATES.map((certificate) => (
							<article
								key={certificate.title}
								style={{
									background: colors.card,
									border: `1px solid ${colors.border}`,
									borderRadius: 16,
									padding: 16,
									boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
								}}
							>
								<div
									className="certificate-preview"
									style={{
										width: "100%",
										height: 280,
										borderRadius: 12,
										border: `1px solid ${colors.border}`,
										background:
											"linear-gradient(135deg, rgba(255,107,26,0.14), rgba(255,255,255,0.02))",
										overflow: "hidden",
										marginBottom: 14,
									}}
								>
									<object
										data={certificate.file}
										type="application/pdf"
										width="100%"
										height="100%"
										style={{ display: "block", background: colors.bg }}
									>
										<div
											style={{
												height: "100%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												padding: 16,
												textAlign: "center",
												color: colors.muted,
												fontWeight: 700,
											}}
										>
											PDF preview unavailable in this browser.
										</div>
									</object>
								</div>
								<h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{certificate.title}</h3>
								<p style={{ margin: "0 0 14px", color: colors.muted, fontSize: 14, lineHeight: 1.5 }}>
									Preview the certificate above or open it in a new tab for the full document.
								</p>
								<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
									<a
										href={certificate.file}
										target="_blank"
										rel="noreferrer"
										style={{
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
											padding: "10px 14px",
											borderRadius: 10,
											background: colors.accent,
											color: "#fff",
											textDecoration: "none",
											fontWeight: 700,
										}}
									>
										Open certificate
									</a>
								</div>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
