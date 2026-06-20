"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Download, MapPin, Linkedin, Github } from "lucide-react";
import ScrollProgress from "./components/ScrollProgress";

export default function Home() {
  const resumeRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!resumeRef.current) return;
    setLoading(true);

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 0.4,
      filename: "NguyenHoangTuan_Fullstack_Resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: "avoid-all" },
    };

    try {
      const clone = resumeRef.current.cloneNode(true) as HTMLElement;

      const footerInClone = clone.querySelector("#resume-footer-not-export");
      if (footerInClone) {
        footerInClone.remove();
      }

      // Hàm helper của bạn đã rất tốt, giữ nguyên
      const colorToRgb = (colorValue: string): string => {
        if (
          !colorValue ||
          colorValue === "none" ||
          colorValue === "transparent"
        ) {
          return colorValue;
        }
        if (colorValue.startsWith("rgb")) {
          return colorValue;
        }
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = colorValue;
            ctx.fillRect(0, 0, 1, 1);
            const imageData = ctx.getImageData(0, 0, 1, 1).data;
            return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
          }
        } catch (e) {
          console.warn("Failed to convert color:", colorValue, e);
        }
        return "rgb(0, 0, 0)";
      };

      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      document.body.appendChild(clone);

      // Translate contact icons down by 18px for PDF export
      const contactIcons = clone.querySelectorAll(".contact-icon");
      contactIcons.forEach((icon) => {
        const iconElement = icon as HTMLElement;
        iconElement.style.transform = "translateY(8px)";
      });

      const allElements = clone.querySelectorAll("*");

      allElements.forEach((el) => {
        const element = el as HTMLElement;

        const computedStyle = window.getComputedStyle(element);

        // Capture all color properties
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        const borderTopColor = computedStyle.borderTopColor;
        const borderBottomColor = computedStyle.borderBottomColor;
        const borderLeftColor = computedStyle.borderLeftColor;
        const borderRightColor = computedStyle.borderRightColor;

        // *** PHẦN SỬA LỖI MỚI ***
        // 1. Vô hiệu hóa (reset) thuộc tính 'background' shorthand.
        // Đây là mấu chốt, vì 'background' shorthand có thể chứa 'oklch(...)'
        // mà 'backgroundColor' không có.
        element.style.background = "none";

        // 2. Áp dụng các thuộc tính màu đã được chuyển đổi (long-hand).
        // Hàm colorToRgb của bạn sẽ xử lý 'oklch' cho từng thuộc tính này.
        // Bằng cách set 'backgroundColor' SAU KHI set 'background: none',
        // chúng ta đảm bảo 'backgroundColor' sẽ được ưu tiên.
        element.style.color = colorToRgb(color);
        element.style.backgroundColor = colorToRgb(backgroundColor);
        element.style.borderTopColor = colorToRgb(borderTopColor);
        element.style.borderBottomColor = colorToRgb(borderBottomColor);
        element.style.borderLeftColor = colorToRgb(borderLeftColor);
        element.style.borderRightColor = colorToRgb(borderRightColor);
        // *** KẾT THÚC PHẦN SỬA LỖI MỚI ***

        // Now remove class attributes
        element.removeAttribute("class");

        // Additional sanitization (phần này của bạn đã tốt)
        const style = element.style;
        if (style) {
          // Khối 'if (style.background)' bây giờ không còn cần thiết
          // vì chúng ta đã xử lý nó ở trên.

          // Override marginTop for bullet dots (6px circles)
          if (
            style.width === "6px" &&
            style.height === "6px" &&
            style.borderRadius === "50%"
          ) {
            style.marginTop = "18px";
            // Đảm bảo dấu chấm có màu, ngay cả khi 'backgroundColor' là transparent
            if (
              !style.backgroundColor ||
              style.backgroundColor === "rgba(0, 0, 0, 0)" ||
              style.backgroundColor === "transparent"
            ) {
              style.backgroundColor = "#3b82f6"; // Dùng màu xanh blue
            }
          }

          // Remove box-shadows that cause artifacts
          if (style.boxShadow && style.boxShadow !== "none") {
            style.boxShadow = "none";
          }

          // Remove filters that cause blur artifacts
          if (style.filter && style.filter !== "none") {
            style.filter = "none";
          }
        }
      });

      clone.removeAttribute("class");

      clone.style.backgroundColor = "#ffffff";
      clone.style.boxShadow = "none";
      clone.style.border = "none";
      clone.style.position = "";
      clone.style.left = "";
      clone.style.top = "";

      document.body.removeChild(clone);

      await html2pdf().from(clone).set(opt).save();
    } catch (err) {
      console.error("html2pdf error", err);
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ScrollProgress />
      <div
        className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-6"
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Nguyen Hoang Tuan
            </h1>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Download size={18} />
              {loading ? "Generating..." : "Download PDF"}
            </button>
          </div>

          <div
            ref={resumeRef}
            className="resume-container mt-8 rounded-2xl border-2 border-gray-200 bg-white shadow-2xl p-10 text-gray-900"
            id="resume-root"
            style={{
              backgroundColor: "#ffffff",
              color: "#1f2937",
              padding: "48px",
              maxWidth: "800px",
              margin: "0 auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Header with Photo */}
            <header
              className="resume-header mb-6 flex items-start gap-6"
              style={{
                display: "flex",
                gap: "28px",
                marginBottom: "32px",
                alignItems: "center",
                padding: "20px",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                position: "relative",
              }}
            >
              {/* QR Code at top right */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 2,
                  width: "90px", // 64px * 1.4 ≈ 90px
                  height: "90px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(59,130,246,0.10)",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="https://res.cloudinary.com/dezcyjtb9/image/upload/v1761795242/QR_yoig6j.png"
                  alt="QR Code"
                  width={76} // 56px * 1.4 ≈ 78px, but use 76 for safe fit
                  height={76}
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <div
                className="avatar-wrapper"
                style={{
                  position: "relative",
                  flexShrink: 0,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "inline-block",
                  border: "4px solid #ffffff",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                }}
              >
                {/* subtle halo */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-4px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
                    borderRadius: "50%",
                    opacity: 0.2,
                    filter: "blur(8px)",
                  }}
                />
                <Image
                  src="https://res.cloudinary.com/dezcyjtb9/image/upload/v1761794541/avatar_wlxnet.jpg"
                  alt="Nguyen Hoang Tuan"
                  width={256}
                  height={341}
                  className="avatar-image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 25%",
                    display: "block",
                    position: "relative",
                  }}
                />
              </div>
              <div className="header-content" style={{ flex: 1 }}>
                <h2
                  className="header-name text-3xl font-bold"
                  style={{
                    fontSize: "36px",
                    fontWeight: "800",
                    marginBottom: "6px",
                    color: "#0f172a",
                    letterSpacing: "-0.8px",
                  }}
                >
                  Nguyen Hoang Tuan
                </h2>
                <p
                  className="header-title text-base font-medium"
                  style={{
                    color: "#3b82f6",
                    fontSize: "19px",
                    marginBottom: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.3px",
                  }}
                >
                  Fullstack Developer
                </p>
                <div
                  className="contact-grid text-sm"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#475569",
                    }}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MapPin size={16} style={{ color: "#3b82f6" }} />
                    </div>
                    <span
                      className="contact-text"
                      style={{ fontSize: "13px", fontWeight: "500" }}
                    >
                      Ho Chi Minh City, Vietnam
                    </span>
                  </div>
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#475569",
                    }}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Linkedin size={16} style={{ color: "#3b82f6" }} />
                    </div>
                    <span
                      className="contact-text"
                      style={{ fontSize: "13px", fontWeight: "500" }}
                    >
                      hoangtuan99
                    </span>
                  </div>
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#475569",
                      gridColumn: "span 2",
                    }}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Github size={16} style={{ color: "#3b82f6" }} />
                    </div>
                    <span
                      className="contact-text"
                      style={{ fontSize: "13px", fontWeight: "500" }}
                    >
                      HoangTuan0611
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Professional Summary */}
            <section className="mb-6" style={{ marginBottom: "24px" }}>
              <h3
                className="mb-2 text-lg font-semibold border-b-2 pb-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  borderBottom: "3px solid #3b82f6",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  color: "#111827",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    paddingLeft: "12px",
                  }}
                >
                  <span
                    style={{
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "20px",
                      backgroundColor: "#3b82f6",
                      borderRadius: "2px",
                    }}
                  />
                  Professional Summary
                </span>
              </h3>
              <p
                className="text-sm"
                style={{
                  color: "#4b5563",
                  fontSize: "15px",
                  lineHeight: "1.8",
                }}
              >
                I&apos;m Hoang Tuan, a Full-Stack Developer with 4+ years of
                experience building scalable backend systems, modern web
                applications, and data-intensive map infrastructure. My recent
                work focuses on geospatial APIs, administrative boundaries,
                pricing boundaries, real-time data pipelines, and production web
                platforms using Go, Python, Node.js, NestJS, Next.js, PostgreSQL,
                PostGIS, MongoDB, ClickHouse, Kafka, and TypeScript.
              </p>
            </section>

            {/* Technical Skills */}
            <section className="mb-6" style={{ marginBottom: "24px" }}>
              <h3
                className="mb-2 text-lg font-semibold border-b-2 pb-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  borderBottom: "3px solid #3b82f6",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  color: "#111827",
                  position: "relative",
                  paddingLeft: "12px",
                }}
              >
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "20px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "2px",
                  }}
                />
                Technical Skills
              </h3>
              <div
                className="grid grid-cols-2 gap-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  fontSize: "14px",
                }}
              >
                <div>
                  <strong style={{ fontWeight: "700", color: "#111827" }}>
                    Frontend:
                  </strong>
                  <span style={{ color: "#4b5563" }}>
                    {" "}
                    React.js, Next.js, Remix.js, Redux, Redux Toolkit, Zustand,
                    Tailwind CSS
                  </span>
                </div>
                <div>
                  <strong style={{ fontWeight: "700", color: "#111827" }}>
                    Backend:
                  </strong>
                  <span style={{ color: "#4b5563" }}>
                    {" "}
                    Node.js, NestJS, Go, Python, Fastify, .NET
                  </span>
                </div>
                <div>
                  <strong style={{ fontWeight: "700", color: "#111827" }}>
                    Languages:
                  </strong>
                  <span style={{ color: "#4b5563" }}>
                    {" "}
                    JavaScript (ES6+), TypeScript, Go, Python, HTML, CSS
                  </span>
                </div>
                <div>
                  <strong style={{ fontWeight: "700", color: "#111827" }}>
                    Databases:
                  </strong>
                  <span style={{ color: "#4b5563" }}>
                    {" "}
                    PostgreSQL, PostGIS, MySQL, SQL Server, Redis, MongoDB,
                    ClickHouse
                  </span>
                </div>
                <div>
                  <strong style={{ fontWeight: "700", color: "#111827" }}>
                    DevOps & Tools:
                  </strong>
                  <span style={{ color: "#4b5563" }}>
                    {" "}
                    Docker, Kubernetes, Azure, Nginx, Elasticsearch, OpenSearch,
                    Kafka, ksqlDB, GitLab CI, Git
                  </span>
                </div>
                <div>
                  <strong style={{ fontWeight: "700", color: "#111827" }}>
                    UI/UX Libraries:
                  </strong>
                  <span style={{ color: "#4b5563" }}>
                    {" "}
                    Ant Design, Semantic UI, Tailwind CSS, Bootstrap
                  </span>
                </div>
              </div>
            </section>

            {/* Professional Experience */}
            <section className="mb-6" style={{ marginBottom: "24px" }}>
              <h3
                className="mb-3 text-lg font-semibold border-b-2 pb-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  borderBottom: "3px solid #3b82f6",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  color: "#111827",
                  position: "relative",
                  paddingLeft: "12px",
                }}
              >
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "20px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "2px",
                  }}
                />
                Professional Experience
              </h3>

              {/* Job 1 */}
              <div className="mb-4" style={{ marginBottom: "20px" }}>
                <div
                  className="flex justify-between items-baseline"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    className="text-base font-semibold"
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    Senior Backend Engineer / Map Infrastructure Owner
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Nov 2025 — Present
                  </div>
                </div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{
                    color: "#3b82f6",
                    fontSize: "15px",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  bTaskee (Full-time) — Vietnam / Regional
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                    marginBottom: "12px",
                  }}
                >
                  Own and build map infrastructure, administrative boundary
                  systems, geographic pricing boundaries, and internal logistics
                  APIs across Vietnam, Thailand, Malaysia, and Indonesia.
                </p>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Key Contributions:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingLeft: "0",
                  }}
                >
                  {[
                    "100% owner of bTaskee's mapping domain, administrative boundaries, and geographic pricing boundaries across 4 regional countries (Vietnam, Thailand, Malaysia, Indonesia).",
                    "Designed and built high-performance map and routing APIs supporting both end-user apps and internal logistics workflows.",
                    "Processed 20M+ message events/day in real-time by integrating and optimizing streaming pipelines with Kafka and ClickHouse, reducing latency by 30%.",
                    "Developed operations portal backend utilizing Remix.js to optimize internal task dispatching and customer support management.",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "#3b82f6",
                          marginTop: "9px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          color: "#4b5563",
                          fontSize: "14px",
                          lineHeight: "1.8",
                          flex: 1,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Technologies Used:
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                  }}
                >
                  Go, Python, Node.js, TypeScript, PostgreSQL, PostGIS, MongoDB,
                  ClickHouse, Kafka, ksqlDB, Remix.js, Docker
                </p>
              </div>

              {/* Job 2 */}
              <div className="mb-4" style={{ marginBottom: "20px" }}>
                <div
                  className="flex justify-between items-baseline"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    className="text-base font-semibold"
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    Fullstack Developer / Backend Lead
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Dec 2024 — Nov 2025
                  </div>
                </div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{
                    color: "#3b82f6",
                    fontSize: "15px",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  TRAVEL EASY (Full-time) — Vietnam
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                    marginBottom: "12px",
                  }}
                >
                  Backend Lead for an online ticketing &amp; booking platform
                  spanning flight tickets, hotels, tours, and eSIM, owning the
                  architecture and core service design.
                </p>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Key Contributions:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingLeft: "0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Led the backend team for an online ticketing &amp; booking
                      platform spanning flight tickets, hotels, tours, and eSIM,
                      owning the architecture and core service design
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Built scalable, secure booking APIs and integrated
                      multi-provider search, payment gateways, and
                      email/notification systems for automated booking and
                      ticketing workflows
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Defined modular data structures and service boundaries, and
                      drove code quality across NestJS and Next.js
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Technologies Used:
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                  }}
                >
                  NestJS, NextJS, TypeScript, MySQL, Redis, Docker, Nginx, Elasticsearch, Github
                </p>
              </div>

              {/* Job 2 */}
              <div className="mb-4" style={{ marginBottom: "20px" }}>
                <div
                  className="flex justify-between items-baseline"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    className="text-base font-semibold"
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    Fullstack Developer
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Nov 2022 — Mar 2024 · 1 yr 5 mos
                  </div>
                </div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{
                    color: "#3b82f6",
                    fontSize: "15px",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Titan Technology Corporation (Full-time) — Vietnam
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                    marginBottom: "12px",
                  }}
                >
                  Revised and maintained software development projects by
                  updating and refactoring code to enhance performance and
                  functionality. Tested new features to ensure stability and
                  alignment with project requirements.
                </p>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Key Contributions:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingLeft: "0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Improved code quality and system efficiency through
                      regular refactoring and performance tuning
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Helped ensure smooth project delivery by identifying bugs
                      early and validating feature completeness
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Played an active role in team collaboration, contributing
                      to better planning and problem-solving
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Received Best Performance Award 2023
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Technologies Used:
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                  }}
                >
                  HTML, CSS, JavaScript, ReactJS, Semantic UI, .NET, Azure, MySQL, Git,
                  SourceTree
                </p>
              </div>

              {/* Job 3 */}
              <div className="mb-4" style={{ marginBottom: "20px" }}>
                <div
                  className="flex justify-between items-baseline"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    className="text-base font-semibold"
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    Fullstack Developer
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Feb 2021 — Nov 2022 · 1 yr 10 mos
                  </div>
                </div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{
                    color: "#3b82f6",
                    fontSize: "15px",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Corsiva Lab Pte Ltd (Full-time) — Singapore
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                    marginBottom: "12px",
                  }}
                >
                  Designed and modified web applications based on client
                  requirements and evolving specifications. Collaborated with
                  web designers, backend developers, and UX designers to build,
                  test, and refine applications.
                </p>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Key Contributions:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    paddingLeft: "0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Created flexible, modular components to accelerate future
                      project development
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Enhanced application stability and performance through
                      thorough debugging and optimization
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Supported team collaboration and streamlined workflows
                      across design and development phases
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#3b82f6",
                        marginTop: "9px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        flex: 1,
                      }}
                    >
                      Contributed to the successful delivery of highly
                      customized and scalable web solutions
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Technologies Used:
                </div>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                  }}
                >
                  HTML, CSS, JavaScript, ReactJS, Bootstrap, NodeJs, MySQL, Mongo, Git
                </p>
              </div>
            </section>

            {/* Education */}
            <section className="mb-6" style={{ marginBottom: "24px" }}>
              <h3
                className="mb-3 text-lg font-semibold border-b-2 pb-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  borderBottom: "3px solid #3b82f6",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  color: "#111827",
                  position: "relative",
                  paddingLeft: "12px",
                }}
              >
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "20px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "2px",
                  }}
                />
                Education
              </h3>
              <div>
                <div
                  className="flex justify-between items-baseline"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    className="text-base font-semibold"
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    Bachelor&apos;s Degree in Software Engineering
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    2017 — 2021
                  </div>
                </div>
                <div
                  className="text-sm font-medium"
                  style={{
                    color: "#3b82f6",
                    fontSize: "15px",
                    marginBottom: "4px",
                    fontWeight: "600",
                  }}
                >
                  VNU-HCM University of Information Technology
                </div>
                <div
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.8",
                  }}
                >
                  GPA: 7.18/10 · Ho Chi Minh City, Vietnam
                </div>
              </div>
            </section>

            {/* Certifications & Awards */}
            <section className="mb-6" style={{ marginBottom: "24px" }}>
              <h3
                className="mb-3 text-lg font-semibold border-b-2 pb-1"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  borderBottom: "3px solid #3b82f6",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  color: "#111827",
                  position: "relative",
                  paddingLeft: "12px",
                }}
              >
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "20px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "2px",
                  }}
                />
                Certifications & Awards
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      marginTop: "9px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Best Performance Award 2023
                    </div>
                    <div
                      style={{
                        color: "#4b5563",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      Titan Technology Corporation · 2023
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      marginTop: "9px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Scholarships for a good student in school year 2019 – 2020
                    </div>
                    <div
                      style={{
                        color: "#4b5563",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      VNU-HCM University of Information Technology · 2020
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      marginTop: "9px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Professional Certifications
                    </div>
                    <div
                      style={{
                        color: "#4b5563",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      Google Prompting Essentials, Google AI Essentials,
                      NestJS: The Complete Developer&apos;s Guide, Introduction to
                      Next.js, Introduction to Docker, Programming with Google
                      Go
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div
              style={{
                marginTop: "32px",
                paddingTop: "20px",
                borderTop: "2px solid #e5e7eb",
                textAlign: "center",
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              <p style={{ marginBottom: "8px" }}>
                More information and certifications available at{" "}
                <span style={{ color: "#3b82f6", fontWeight: "600" }}>
                  hoangtuan.me
                </span>
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                4+ years of professional full-stack development experience
              </p>
            </div>
          </div>

          {/* Footer - Not exported to PDF */}
          <footer
            className="resume-footer mt-8 text-center"
            id="resume-footer-not-export"
            style={{
              padding: "32px 20px",
              borderTop: "2px solid #e2e8f0",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <a
                href="https://hoangtuan.me"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#3b82f6";
                }}
              >
                <span>🌐</span>
                <span>hoangtuan.me</span>
              </a>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                &copy; {new Date().getFullYear()} Nguyen Hoang Tuan. All rights
                reserved.
              </p>
            </div>
          </footer>

          {/* Responsive Styles */}
          <style jsx global>{`
            @media (max-width: 768px) {
              .resume-container {
                padding: 24px !important;
              }

              .resume-header {
                flex-direction: column !important;
                align-items: center !important;
                text-align: center;
                padding: 16px !important;
                gap: 20px !important;
              }

              /* Hide QR code on small devices */
              .resume-header > div:first-child {
                display: none !important;
              }

              .avatar-wrapper {
                margin-bottom: 8px;
              }

              .avatar-image {
                width: 100px !important;
                height: 100px !important;
              }

              .header-content {
                width: 100%;
              }

              .header-name {
                font-size: 28px !important;
                text-align: center;
              }

              .header-title {
                font-size: 16px !important;
                text-align: center;
              }

              .contact-grid {
                grid-template-columns: 1fr !important;
                gap: 10px !important;
              }

              .contact-item {
                justify-content: flex-start !important;
                width: 100% !important;
              }

              .contact-item[style*="span 2"] {
                grid-column: span 1 !important;
              }

              .contact-item > div:first-child {
                flex-shrink: 0 !important;
              }

              .contact-text {
                font-size: 12px !important;
                word-break: break-word;
              }

              .grid.grid-cols-2 {
                grid-template-columns: 1fr !important;
              }

              h3 {
                font-size: 18px !important;
              }

              .flex.justify-between {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 4px !important;
              }
            }

            @media (max-width: 480px) {
              .resume-container {
                padding: 16px !important;
                border-radius: 12px !important;
              }

              .avatar-image {
                width: 80px !important;
                height: 80px !important;
              }

              .header-name {
                font-size: 24px !important;
              }

              .header-title {
                font-size: 14px !important;
              }

              .contact-text {
                font-size: 11px !important;
              }
            }

            @media print {
              body {
                background: white !important;
              }

              .resume-container {
                padding: 48px !important;
                box-shadow: none !important;
                border: none !important;
                background: white !important;
              }

              /* Hide footer and scroll progress in PDF export */
              .resume-footer,
              #resume-footer-not-export,
              #scroll-progress-indicator {
                display: none !important;
              }

              .resume-header {
                flex-direction: row !important;
                align-items: center !important;
                text-align: left !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                background: white !important;
                border: none !important;
              }

              /* Prevent orphaned headings - keep heading with at least some content */
              h3 {
                page-break-after: avoid !important;
                break-after: avoid !important;
              }

              .avatar-image {
                width: 120px !important;
                height: 120px !important;
              }

              .header-name {
                font-size: 36px !important;
                text-align: left !important;
              }

              .header-title {
                font-size: 19px !important;
                text-align: left !important;
              }

              .contact-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }

              .contact-item {
                justify-content: flex-start !important;
              }

              .contact-text {
                font-size: 13px !important;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
