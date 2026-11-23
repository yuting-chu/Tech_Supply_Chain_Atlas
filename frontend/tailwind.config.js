/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        layer: {
          L1: "#3B82F6", // 藍色 - 上游材料
          L2: "#06B6D4", // 青色 - 製造設備
          L3: "#10B981", // 綠色 - EDA/IP
          L4: "#F59E0B", // 琥珀金 - 晶片設計
          L5: "#EF4444", // 紅色 - 晶圓製造 (核心瓶頸)
          L6: "#8B5CF6", // 紫色 - 先進封裝
          L7: "#EC4899", // 粉紅 - 零組件/散熱/HBM
          L8: "#6366F1", // 靛藍 - 終端系統/CSP
        }
      }
    },
  },
  plugins: [],
}
