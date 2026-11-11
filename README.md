# A13input  A13輸入資料 https://achir1015.github.io/A13input/


https://github.com/user-attachments/assets/0bdc0225-ff4a-4cf5-bf33-12a131732047


## 公司／部門與管理者密碼

與「線上月班表管理系統」同一套做法：


https://github.com/user-attachments/assets/cad2a76a-7b66-4ac8-803a-d6367c34ce1f


```
Firebase 帳號登入（程式內建，自動）
 └─ 公司（例：臺北市立聯合醫院忠孝院區）
     └─ 部門（例：呼吸照護病房）　← 管理者密碼
```

- 開啟網頁先選「公司／部門」並輸入管理者密碼；可勾選「此裝置記住」。工具列 🔒 可鎖定／切換單位。
- **各部門的病床、照護紀錄、交班注意事項、電子版組別完全分開**。原始單位（呼吸照護病房）沿用既有資料，文件 ID 不變；其他單位的文件 ID 加「單位ID__」前綴並帶 `orgId`。
- **公司／部門與密碼不在 A13 維護**：A13 直接讀取「月班表管理系統（rcw-month）」雲端上的 `orgs`，在月班表系統新增、編輯（改名、換密碼、刪除）後，A13 重新開啟就同步。新單位在 A13 一開始只有一床空白床，請到「病床資料管理」新增。
- A13 以程式內的帳號（`RCW_LOGIN`）登入月班表系統的 Firebase 讀取單位清單；該帳號必須存在於月班表專案的 Authentication。讀不到時退回內建的呼吸照護病房，仍可使用。
- 密碼只存 SHA-256 雜湊值（算法與月班表系統相同）。原始單位預設管理者密碼與月班表系統相同。

## 📱 App 版本（Android / iPhone）

本專案用 [Capacitor](https://capacitorjs.com/) 把網頁版「包成」原生 App（比喻：網頁是食物，App 是便當盒，內容同一份）。
網頁檔案只有一份：`index.html`，三個平台共用。

| 平台 | 資料夾 | 取得方式 |
|---|---|---|
| 網頁 | `index.html` | GitHub Pages |
| Android | `android/` | Actions →「打包 Android APK」→ 下載 `A13-android-debug-apk` → 手機安裝 |
| iPhone | `ios/` | 需 Mac + Xcode，開啟 `ios/App/App.xcworkspace` |

### 更新網頁後，同步到 App
```bash
npm install          # 第一次
npm run sync         # 把 index.html 複製到 www/ 並同步到 android、ios
```

### Android
1. 到 GitHub 的 **Actions** 分頁，執行「打包 Android APK」，完成後下載 APK。
2. 手機允許「安裝未知來源 App」後安裝即可。
3. 要上架 Google Play 需改用簽署的 release 版本（`npx cap open android` 用 Android Studio 產生）。

### iPhone
1. 在 Mac 安裝 Xcode 與 CocoaPods，執行 `npm install && npx cap sync ios`。
2. `npx cap open ios`，在 Signing 選你的 Apple ID / 開發者帳號，接上 iPhone 按執行。
3. 免費 Apple ID 可自裝（7 天到期）；TestFlight / App Store 需 Apple Developer Program（US$99/年）。
4. Actions 的「打包 iOS」只驗證能編譯，不產生可安裝檔（沒有簽署憑證）。

### Firebase 注意事項
App 內網址為 `localhost`（Android: https://localhost、iOS: capacitor://localhost）。
若登入出現 unauthorized-domain，請到 Firebase Console → Authentication → Settings → 授權網域，確認有 `localhost`。

---

<img width="1917" height="946" alt="image" src="https://github.com/user-attachments/assets/e5299440-e08f-4349-ba0f-dee68b79cf09" />

A13 照護紀錄系統 — 功能總結

這是什麼
把原本紙本／院內舊系統的「病房助理照護作業」表單，做成一個能在瀏覽器（含手機）直接使用、資料存在雲端的線上系統，護理站白班、小夜、大夜都能共用同一份即時資料。

核心資料模型
31 床（含 1 床隔離床）× 3 班別（白班／小夜／大夜） = 93 格獨立資料，每一格用「班別＋床號」當索引鍵，切換床位或班別時資料不會跳位、不會互相覆蓋
每一格資料涵蓋五大分類：身體清潔舒適照護、排泄照護、膳食與給藥、舒適與活動、一般技術性，對照原始表單的 1-1～5-4 逐項還原
<img width="731" height="440" alt="image" src="https://github.com/user-attachments/assets/f7387c91-29ce-4852-98d6-0159b80718bc" />


目前限制（誠實告知）
病人資料是示範用假資料，尚未接上真實 HIS／病歷系統
目前所有登入帳號權限相同（皆可讀寫全部 93 格），若要做到「白班帳號限看白班」這類分權，需再調整 Firestore 安全規則
沒有離線佇列機制，網路中斷時的寫入僅停留在本機，需連線恢復後重新操作
尚未做完整的個資保護／法規遵循（如 PDPA、院內資安規範）評估，正式導入前建議由院方資安與法務把關

如果要往「正式上線」推進，下一步通常會是：串接真實病人主檔資料來源、依角色分權限、以及加上稽核報表／匯出格式對接院內既有系統，這些都可以再逐步往下做。
