import fs from 'node:fs';

const BASE_DIR = 'C:/Users/veman.chippa/AppData/Roaming/npm/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai';

// 1. Update dsh-client-ui-brand-official/lib/client.js
const brandPath = `${BASE_DIR}/dsh-client-ui-brand-official/lib/client.js`;
if (fs.existsSync(brandPath)) {
  if (!fs.existsSync(brandPath + '.bak')) {
    fs.copyFileSync(brandPath, brandPath + '.bak');
  }
  const code = `window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-brand-official",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");

		const DEEPSEEK_WHALE_PATH = "M23.0584 4.95203C22.8129 4.83203 22.7074 5.06103 22.5639 5.17704C22.5149 5.21454 22.4734 5.26354 22.4319 5.30854C22.0734 5.69155 21.6543 5.94306 21.1073 5.91306C20.3073 5.86806 19.6243 6.11957 19.0203 6.73158C18.8918 5.97706 18.4652 5.52655 17.8162 5.23754C17.4767 5.08753 17.1332 4.93703 16.8952 4.61052C16.7292 4.37801 16.6837 4.11901 16.6007 3.8635C16.5477 3.70949 16.4952 3.55199 16.3177 3.52549C16.1252 3.49549 16.0497 3.65699 15.9742 3.792C15.6722 4.34401 15.5552 4.95203 15.5667 5.56805C15.5932 6.95359 16.1782 8.05712 17.3407 8.84215C17.4727 8.93215 17.5067 9.02215 17.4652 9.15366C17.3857 9.42416 17.2917 9.68667 17.2087 9.95718C17.1557 10.1297 17.0767 10.1677 16.8917 10.0922C16.2537 9.82568 15.7027 9.43117 15.2156 8.95465C14.3891 8.15513 13.6416 7.2726 12.7096 6.58158C12.4906 6.42007 12.2716 6.27007 12.045 6.12707C11.094 5.20354 12.1696 4.44502 12.4186 4.35501C12.6791 4.26101 12.5091 3.938 11.6675 3.942C10.826 3.9455 10.056 4.22751 9.07446 4.60302C8.93096 4.65952 8.77995 4.70052 8.62545 4.73452C7.73492 4.56552 6.80989 4.52802 5.84386 4.63702C4.02481 4.83953 2.57177 5.69955 1.50373 7.1676C0.220694 8.93215 -0.0813148 10.9372 0.288196 13.0283C0.676708 15.2323 1.80174 17.0569 3.53029 18.4834C5.32285 19.9625 7.38741 20.6875 9.74298 20.5485C11.1735 20.466 12.7661 20.2745 14.5626 18.7539C15.0156 18.9795 15.4912 19.0695 16.2797 19.137C16.8872 19.1935 17.4722 19.107 17.9252 19.013C18.6347 18.8629 18.5857 18.2059 18.3292 18.0854C16.2497 17.1169 16.7062 17.5109 16.2912 17.1919C17.3477 15.9419 18.9618 13.7198 19.4598 10.6942C19.5088 10.3602 19.5713 9.88968 19.5638 9.61917C19.5598 9.45417 19.5978 9.39016 19.7863 9.37116C20.3073 9.31116 20.8128 9.16866 21.2773 8.91315C22.6249 8.17713 23.1684 6.96809 23.2964 5.51905C23.3154 5.29754 23.2924 5.06853 23.0584 4.95203Z";

		function IVemanLogo({ size = 24, className }) {
			const s = size || 24;
			return react_jsx_runtime.jsxs("svg", {
				width: s,
				height: s,
				viewBox: "0 0 32 32",
				className: className,
				fill: "none",
				style: { verticalAlign: "middle", borderRadius: Math.round(s * 0.22) + "px", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 8px rgba(99, 102, 241, 0.35)" },
				children: [
					react_jsx_runtime.jsx("rect", { width: "32", height: "32", rx: "7", fill: "url(#iveman-grad)" }),
					react_jsx_runtime.jsx("path", {
						d: "M7 11h3v11H7zM13 11h3l3.5 7.5L23 11h3l-5 11h-3l-5-11z",
						fill: "#ffffff",
						fillRule: "evenodd"
					}),
					react_jsx_runtime.jsx("circle", { cx: "8.5", cy: "7.5", r: "1.6", fill: "#ffffff" }),
					react_jsx_runtime.jsx("defs", {
						children: react_jsx_runtime.jsxs("linearGradient", {
							id: "iveman-grad",
							x1: "0",
							y1: "0",
							x2: "32",
							y2: "32",
							gradientUnits: "userSpaceOnUse",
							children: [
								react_jsx_runtime.jsx("stop", { stopColor: "#4f46e5" }),
								react_jsx_runtime.jsx("stop", { offset: "0.5", stopColor: "#6366f1" }),
								react_jsx_runtime.jsx("stop", { offset: "1", stopColor: "#06b6d4" })
							]
						})
					})
				]
			});
		}

		function OfficialBrandMark({ size }) {
			return react_jsx_runtime.jsx(IVemanLogo, { size: size || 24 });
		}

		function HeroBrandMark({ size, className }) {
			return react_jsx_runtime.jsx(IVemanLogo, { size: size || 34, className });
		}

		function OfficialBrandName() {
			return react_jsx_runtime.jsxs("div", {
				style: { display: "flex", flexDirection: "column", justifyContent: "center", userSelect: "none", lineHeight: "1.1" },
				children: [
					react_jsx_runtime.jsxs("div", {
						style: { display: "inline-flex", alignItems: "center", gap: "5px" },
						children: [
							react_jsx_runtime.jsx("span", {
								className: "iveman-brand-title",
								style: {
									fontWeight: "700",
									fontSize: "15px",
									letterSpacing: "-0.02em",
									fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
								},
								children: "iVeman"
							}),
							react_jsx_runtime.jsx("span", {
								className: "iveman-badge",
								style: {
									fontSize: "8.5px",
									fontWeight: "700",
									textTransform: "uppercase",
									letterSpacing: "0.06em",
									background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
									color: "#ffffff",
									padding: "1.5px 5px",
									borderRadius: "3px",
									boxShadow: "0 1px 4px rgba(79, 70, 229, 0.3)"
								},
								children: "HARNESS"
							})
						]
					}),
					react_jsx_runtime.jsxs("div", {
						className: "iveman-subtext",
						style: {
							display: "inline-flex",
							alignItems: "center",
							gap: "3.5px",
							fontSize: "9.5px",
							fontWeight: "500",
							marginTop: "2px",
							whiteSpace: "nowrap"
						},
						children: [
							react_jsx_runtime.jsx("span", { children: "Built on" }),
							react_jsx_runtime.jsx("svg", {
								width: "11",
								height: "11",
								viewBox: "0 0 24 24",
								fill: "currentColor",
								style: { opacity: 0.9, flexShrink: 0 },
								children: react_jsx_runtime.jsx("path", { d: DEEPSEEK_WHALE_PATH })
							}),
							react_jsx_runtime.jsx("span", {
								style: { fontWeight: "600" },
								children: "DeepSeek Harness"
							})
						]
					})
				]
			});
		}

		const inject = ["slots"];
		function apply(ctx) {
			ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.inject("sidebar.brand.name", function* () {
				yield ctx.slots.register({ name: "sidebar.brand.mark" }, OfficialBrandMark);
				yield ctx.slots.register({ name: "sidebar.brand.name" }, OfficialBrandName);
			}));
			ctx.slots.inject("conversation.hero.brand.mark", function* () {
				yield ctx.slots.register({ name: "conversation.hero.brand.mark" }, HeroBrandMark);
			});
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
`;
  fs.writeFileSync(brandPath, code, 'utf8');
  console.log('Successfully updated dsh-client-ui-brand-official/lib/client.js');
}

// 2. Update dsh-client-ui-layout/lib/client.js (productTitle -> iVeman)
const layoutPath = `${BASE_DIR}/dsh-client-ui-layout/lib/client.js`;
if (fs.existsSync(layoutPath)) {
  if (!fs.existsSync(layoutPath + '.bak')) {
    fs.copyFileSync(layoutPath, layoutPath + '.bak');
  }
  let layoutCode = fs.readFileSync(layoutPath, 'utf8');
  layoutCode = layoutCode.replaceAll('const productTitle = "DeepSeek Harness";', 'const productTitle = "iVeman";');
  layoutCode = layoutCode.replaceAll('productTitle = "DeepSeek Harness"', 'productTitle = "iVeman"');
  layoutCode = layoutCode.replaceAll('"DeepSeek Harness"', '"iVeman"');
  fs.writeFileSync(layoutPath, layoutCode, 'utf8');
  console.log('Successfully updated dsh-client-ui-layout/lib/client.js');
}

// 3. Update dsh-client-ui-conversation/lib/client.js
const convPath = `${BASE_DIR}/dsh-client-ui-conversation/lib/client.js`;
if (fs.existsSync(convPath)) {
  let convCode = fs.readFileSync(convPath, 'utf8');
  if (!fs.existsSync(convPath + '.bak')) {
    fs.copyFileSync(convPath, convPath + '.bak');
  }
  convCode = convCode.replaceAll('"hero.headline": "Into the Unknown"', '"hero.headline": "iVeman Studio"');
  convCode = convCode.replaceAll('"hero.headline":"Into the Unknown"', '"hero.headline":"iVeman Studio"');
  fs.writeFileSync(convPath, convCode, 'utf8');
  console.log('Successfully updated dsh-client-ui-conversation/lib/client.js');
}

// 4. Update index.html
const distDir = `${BASE_DIR}/dsh-web-frontend/dist`;
const htmlPath = `${distDir}/index.html`;
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (!fs.existsSync(htmlPath + '.bak')) {
    fs.copyFileSync(htmlPath, htmlPath + '.bak');
  }
  html = html.replace(/<title>.*?<\/title>/, '<title>iVeman</title>');

  // Ensure clean styling in head
  const customStyles = `
    <!-- iveman-branding-styles -->
    <style id="iveman-styles">
      /* Auto-adapting brand title for Light and Dark Modes */
      .iveman-brand-title {
        color: var(--dsw-alias-label-primary, #0f172a) !important;
        transition: color 0.15s ease;
      }
      body[data-ds-dark-theme] .iveman-brand-title,
      html[data-theme='dark'] .iveman-brand-title,
      [data-theme='dark'] .iveman-brand-title {
        color: #f8fafc !important;
      }
      @media (prefers-color-scheme: dark) {
        :not([data-theme='light']) .iveman-brand-title {
          color: #f8fafc !important;
        }
      }

      /* Auto-adapting subtext for Light and Dark Modes */
      .iveman-subtext {
        color: var(--dsw-alias-label-tertiary, #64748b) !important;
        transition: color 0.15s ease;
      }
      body[data-ds-dark-theme] .iveman-subtext,
      html[data-theme='dark'] .iveman-subtext,
      [data-theme='dark'] .iveman-subtext {
        color: #94a3b8 !important;
      }
      @media (prefers-color-scheme: dark) {
        :not([data-theme='light']) .iveman-subtext {
          color: #94a3b8 !important;
        }
      }

      /* Allow brand container in sidebar to comfortably fit the 2-line title and subtext */
      span[class*='brandIdentity'] {
        height: auto !important;
        min-height: 28px !important;
        max-height: 48px !important;
        overflow: visible !important;
        align-items: center !important;
      }
      span[class*='brandName'] {
        height: auto !important;
        min-height: 28px !important;
        max-height: 48px !important;
        overflow: visible !important;
      }
      button[class*='brand'] {
        height: auto !important;
        max-height: 48px !important;
        overflow: visible !important;
      }
    </style>
`;
  if (html.includes('<!-- iveman-branding-styles -->')) {
    html = html.replace(/<!-- iveman-branding-styles -->[\s\S]*?<\/style>/, customStyles.trim());
  } else {
    html = html.replace('</head>', `${customStyles}</head>`);
  }
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Successfully updated index.html with dark mode styles');
}

// 5. Update favicon.svg and favicon-dark.svg
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32" fill="none">
  <defs>
    <linearGradient id="iv-fav-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4f46e5" />
      <stop offset="0.5" stop-color="#6366f1" />
      <stop offset="1" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="7" fill="url(#iv-fav-grad)" />
  <path d="M7 11h3v11H7zM13 11h3l3.5 7.5L23 11h3l-5 11h-3l-5-11z" fill="#ffffff" fill-rule="evenodd" />
  <circle cx="8.5" cy="7.5" r="1.6" fill="#ffffff" />
</svg>
`;

fs.writeFileSync(`${distDir}/favicon.svg`, faviconSvg, 'utf8');
fs.writeFileSync(`${distDir}/favicon-dark.svg`, faviconSvg, 'utf8');
console.log('Successfully updated favicon.svg and favicon-dark.svg');
