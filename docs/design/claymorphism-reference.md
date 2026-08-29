## 黏土质感的提示词

### 1. 角色设定

你是一位专注于 **Claymorphism（黏土形态）** 风格的 UI/UX 设计专家，擅长打破传统扁平化设计的枯燥，通过模拟物理世界的 **黏土质感、蓬松形态和柔和光影**，创造出极具亲和力和趣味性的数字界面。你的设计哲学是「**数字世界的实体化与软化**」，旨在让用户感受到屏幕背后的元素仿佛是真实存在的、可触摸的柔软物体，而非冰冷的像素。

### 2. 场景定位

**适用场景**：

- **Web3、NFT 与元宇宙项目**：利用其独特的 3D 属性和新潮感，展示虚拟资产或创建沉浸式体验。
- **儿童教育与早教应用**：柔软、圆润的视觉语言天然具有安全性与亲和力，能降低儿童的认知负担。
- **创意作品集与个人博客**：通过强烈的视觉风格展示设计师的个性和前卫审美。
- **休闲游戏界面**：与游戏内的卡通渲染风格高度契合，增强整体的娱乐氛围。
- **健康与冥想应用**：柔和的色彩和圆滑的形态有助于传递放松、舒缓的情绪。

**不适用场景**：

- **数据密集型后台管理系统（Dashboard）**：厚重的阴影和边距会占用大量屏幕空间，降低信息密度。
- **严肃的金融或法律文档处理**：过于活泼和童趣的风格会削弱权威感与专业严肃性。

### 3. 视觉设计理念

Claymorphism 的核心在于**「蓬松感」**与**「悬浮感」**。

- **反扁平化**：拒绝锐利的边缘和完全平坦的色块。每个 UI 元素都应该像是一个充气的气球或一块捏好的橡皮泥。
- **极致圆润**：所有的矩形都应该拥有巨大的圆角（Border Radius），按钮甚至可以接近胶囊形或圆形，模拟手工捏制的自然弧度。
- **空间层次**：通过强烈的深度暗示，让元素看起来是「漂浮」在背景之上的，或者是从背景中「凸起」的实体。

### 4. 材质与质感

要实现逼真的黏土质感，必须精细控制光影（CSS `box-shadow` 的高级应用）：

- **哑光表面（Matte Finish）**：黏土不是塑料或玻璃，不应有强烈的高光反射。表面应呈现漫反射，质感细腻且略带粗糙度。
- **双重阴影机制**：
  - **外部阴影（Drop Shadow）**：使用深色、大模糊半径的投影，营造物体悬浮的高度感。通常使用两个投影：一个深色模拟遮挡，一个浅色模拟环境光反射。
  - **内部阴影（Inner Shadow）**：这是 Claymorphism 的灵魂。在元素内部上方添加浅色内阴影（高光），在内部下方添加深色内阴影。这能营造出物体边缘的**厚度**和**圆滑的倒角**，产生类似 3D 建模的充气效果。
- **色彩策略**：偏向使用**高明度、低饱和度**的马卡龙色系（Macaron Colors）或粉彩（Pastel Colors）。背景色通常与主体色系保持一致但略浅，以减少视觉冲突，增强整体的柔和感。

### 5. 交互体验

交互设计应模拟物理按压的反馈：

- **Hover（悬停）**：元素轻微上浮，阴影扩散，暗示它是可交互的实体。
- **Active（点击/按压）**：这是体验的关键。点击时，元素不应只是变色，而应模拟**被按下去**的物理状态。
  - **视觉变化**：外部阴影收缩或消失，内部阴影加深，模拟物体被压入平面或变扁的状态。
  - **动态效果**：使用弹性曲线（Spring Animation），让按钮在松开时有「回弹」的果冻感。
- **表单输入**：输入框看起来应该像是黏土表面被「挖」出的一个凹槽（Neumorphism 的凹陷风格的柔软变体）。

### 6. 整体氛围

Claymorphism 营造的是一种**温暖、乐观、安全且充满好奇心**的氛围。它唤起了用户童年玩橡皮泥的触觉记忆，消除了技术的冰冷距离感。整个界面应该像是一个精心布置的玩具屋，每一个组件都让人忍不住想去戳一下、捏一下。这种风格传递出的情感是：「别紧张，这里很有趣，随便玩。」

---

## 代码示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Claymorphism Design System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="fullpage.css" />
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/assets/index-xfgqKiMF.css" />
    <style>
      :root {
        /* Palette: Pastel / Macaron Colors */
        --bg-color: #e0e5ec;
        --text-main: #4a5568;
        --text-light: #718096;

        --clay-surface: #e0e5ec;

        /* Accents */
        --accent-pink: #ffafcc;
        --accent-blue: #a2d2ff;
        --accent-purple: #cdb4db;
        --accent-green: #b7e4c7;

        /* Shadow Variables - The Soul of Claymorphism */
        /* Convex (Popping out) */
        --shadow-convex:
          9px 9px 16px rgb(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5),
          inset 5px 5px 10px rgba(163, 177, 198, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 0.5);

        /* Concave (Pressed in / Input fields) */
        --shadow-concave:
          inset 6px 6px 10px rgb(163, 177, 198, 0.7), inset -6px -6px 10px rgba(255, 255, 255, 0.8);

        /* Floating Hover State */
        --shadow-hover:
          14px 14px 24px rgb(163, 177, 198, 0.6), -14px -14px 24px rgba(255, 255, 255, 0.5),
          inset 5px 5px 10px rgba(163, 177, 198, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 0.5);

        /* Active / Pressed State */
        --shadow-active:
          inset 4px 4px 8px rgb(163, 177, 198, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.8);
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Nunito", sans-serif;
        background-color: var(--bg-color);
        color: var(--text-main);
        line-height: 1.6;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }

      /* --- Layout & Typography --- */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      h1,
      h2,
      h3 {
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.02em;
      }

      h1 {
        font-size: 3.5rem;
        line-height: 1.1;
        margin-bottom: 1.5rem;
      }
      h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      p {
        color: var(--text-light);
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
      }

      /* --- The Clay Components --- */

      /* 1. Base Clay Card (The Fluffy Shape) */
      .clay-card {
        background-color: var(--clay-surface);
        border-radius: 35px; /* Extreme rounded corners */
        padding: 2.5rem;
        border: 2px solid rgba(255, 255, 255, 0.2); /* Subtle matte border */
        box-shadow: var(--shadow-convex);
        transition:
          transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55),
          box-shadow 0.3s ease;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      /* Hover Effect: Floating Up */
      .clay-card.interactive:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-hover);
        z-index: 10;
      }

      /* 2. Clay Button (The Jelly Interaction) */
      .clay-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 1rem 2.5rem;
        font-weight: 800;
        font-size: 1.1rem;
        color: #fff;
        border: none;
        border-radius: 50px; /* Pill shape */
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        /* Colored Clay Buttons need specific shadow adjustments to blend */
        box-shadow:
          6px 6px 12px rgba(0, 0, 0, 0.15),
          -6px -6px 12px rgba(255, 255, 255, 0.4),
          inset 3px 3px 6px rgba(0, 0, 0, 0.1),
          inset -3px -3px 6px rgba(255, 255, 255, 0.3);
        text-decoration: none;
      }

      /* Button Variants */
      .btn-primary {
        background-color: var(--accent-blue);
        color: #43658b;
      }
      .btn-secondary {
        background-color: var(--accent-pink);
        color: #8a4860;
      }
      .btn-accent {
        background-color: var(--accent-green);
        color: #3d6b4f;
      }

      /* Active Effect: The Squish */
      .clay-btn:active {
        transform: scale(0.95);
        box-shadow:
          inset 4px 4px 8px rgba(0, 0, 0, 0.15),
          inset -4px -4px 8px rgba(255, 255, 255, 0.3);
      }

      /* 3. Clay Inputs (The Concave/Carved Look) */
      .clay-input {
        width: 100%;
        padding: 1.2rem 1.5rem;
        border: none;
        border-radius: 25px;
        background-color: var(--clay-surface);
        box-shadow: var(--shadow-concave);
        font-family: inherit;
        font-size: 1rem;
        color: var(--text-main);
        outline: none;
        transition: box-shadow 0.2s ease;
      }

      .clay-input:focus {
        box-shadow:
          inset 8px 8px 12px rgb(163, 177, 198, 0.8),
          inset -8px -8px 12px rgba(255, 255, 255, 0.9);
      }

      /* --- Sections --- */

      /* Header */
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        margin-bottom: 3rem;
      }

      .logo {
        font-weight: 900;
        font-size: 1.5rem;
        color: var(--text-main);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .nav-pills {
        display: flex;
        gap: 1rem;
      }

      /* Hero Section */
      .hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        min-height: 70vh;
      }

      .hero-image {
        position: relative;
        height: 400px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Abstract Floating Shapes */
      .shape {
        position: absolute;
        border-radius: 45% 55% 40% 60% / 50% 60% 40% 50%; /* Blobs */
        animation: float 6s ease-in-out infinite;
        box-shadow: var(--shadow-convex);
      }

      .shape-1 {
        width: 250px;
        height: 250px;
        background-color: var(--accent-blue);
        z-index: 2;
      }

      .shape-2 {
        width: 180px;
        height: 180px;
        background-color: var(--accent-pink);
        top: 20px;
        right: 40px;
        z-index: 1;
        animation-delay: 1s;
      }

      .shape-3 {
        width: 120px;
        height: 120px;
        background-color: var(--accent-green);
        bottom: 40px;
        left: 50px;
        z-index: 3;
        animation-delay: 2s;
      }

      @keyframes float {
        0%,
        100% {
          transform: translate(0, 0) rotate(0deg);
          border-radius: 45% 55% 40% 60% / 50% 60% 40% 50%;
        }
        33% {
          transform: translate(0, -20px) rotate(5deg);
          border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
        }
        66% {
          transform: translate(0, 10px) rotate(-5deg);
          border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%;
        }
      }

      /* Features Section */
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2.5rem;
        margin: 5rem 0;
      }

      .icon-box {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: var(--bg-color);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: var(--text-main);
        box-shadow: var(--shadow-convex);
      }

      /* UI Elements Sandbox */
      .sandbox {
        margin-top: 5rem;
      }

      .sandbox-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
      }

      .ui-component-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        align-items: center;
        flex-wrap: wrap;
      }

      /* Toggle Switch Clay Style */
      .clay-toggle {
        width: 80px;
        height: 40px;
        border-radius: 40px;
        background-color: var(--bg-color);
        box-shadow: var(--shadow-concave);
        position: relative;
        cursor: pointer;
      }

      .toggle-handle {
        width: 32px;
        height: 32px;
        background-color: var(--accent-purple);
        border-radius: 50%;
        position: absolute;
        top: 4px;
        left: 4px;
        box-shadow: var(--shadow-convex);
        transition: transform 0.3s cubic-bezier(0.85, 0.05, 0.18, 1.35);
      }

      .clay-toggle.active .toggle-handle {
        transform: translateX(40px);
        background-color: var(--accent-blue);
      }

      /* Avatar Stack */
      .avatar-stack {
        display: flex;
        padding-left: 10px;
      }

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid var(--bg-color);
        background-size: cover;
        margin-left: -15px;
        box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
        position: relative;
        background-color: #ddd;
      }

      .avatar:nth-child(1) {
        z-index: 3;
        background-color: var(--accent-pink);
      }
      .avatar:nth-child(2) {
        z-index: 2;
        background-color: var(--accent-blue);
      }
      .avatar:nth-child(3) {
        z-index: 1;
        background-color: var(--accent-green);
      }

      /* Responsive */
      @media (max-width: 768px) {
        h1 {
          font-size: 2.5rem;
        }
        .hero {
          grid-template-columns: 1fr;
          text-align: center;
        }
        .hero-image {
          order: -1;
          height: 300px;
        }
        .sandbox-grid {
          grid-template-columns: 1fr;
        }
        .clay-btn {
          width: 100%;
        }
      }

      /* Floating Badge */
      .badge {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 800;
        background: var(--accent-pink);
        color: #8a4860;
        margin-bottom: 1rem;
        box-shadow:
          3px 3px 6px rgba(0, 0, 0, 0.1),
          inset 1px 1px 2px rgba(255, 255, 255, 0.4);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Navigation -->
      <header>
        <div
          class="clay-card interactive"
          style="padding: 0.5rem 1.5rem; border-radius: 50px; flex-direction: row; gap: 10px;"
        >
          <div class="logo"><i data-lucide="box"></i> ClayUI</div>
        </div>

        <nav class="nav-pills">
          <a
            href="#"
            class="clay-btn btn-primary"
            style="padding: 0.5rem 1.5rem; font-size: 0.9rem;"
            >Connect Wallet</a
          >
        </nav>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <span class="badge">Web3 & NFT Ready</span>
          <h1>Soft, Tactile,<br /><span style="color: var(--accent-blue);">Inflatable.</span></h1>
          <p>
            Experience the digital world with a sense of touch. Claymorphism adds volume, depth, and
            a playful spirit to your interface.
          </p>
          <div class="ui-component-row">
            <a href="#" class="clay-btn btn-secondary"
              >Get Started <i data-lucide="arrow-right"></i
            ></a>
            <a
              href="#"
              class="clay-btn"
              style="color: var(--text-main); background: var(--bg-color);"
              >Learn More</a
            >
          </div>

          <!-- Social Proof -->
          <div style="display: flex; align-items: center; gap: 1rem; margin-top: 2rem;">
            <div class="avatar-stack">
              <div class="avatar"></div>
              <div class="avatar"></div>
              <div class="avatar"></div>
            </div>
            <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-light);"
              >Loved by creatives</span
            >
          </div>
        </div>

        <div class="hero-image">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </section>

      <!-- Features -->
      <section class="features-grid">
        <div class="clay-card interactive">
          <div class="icon-box" style="color: var(--accent-blue);">
            <i data-lucide="cloud"></i>
          </div>
          <h3>Anti-Flat</h3>
          <p>
            Rejecting sharp edges for a world made of soft, matte rubber. Everything feels
            touchable.
          </p>
        </div>

        <div class="clay-card interactive">
          <div class="icon-box" style="color: var(--accent-pink);">
            <i data-lucide="layers"></i>
          </div>
          <h3>Deep Layers</h3>
          <p>
            Using dual inner shadows to create volume, making elements look like they are inflated.
          </p>
        </div>

        <div class="clay-card interactive">
          <div class="icon-box" style="color: var(--accent-green);">
            <i data-lucide="smile"></i>
          </div>
          <h3>Playful Vibes</h3>
          <p>
            Perfect for education, casual games, and creative portfolios. Safe, round, and friendly.
          </p>
        </div>
      </section>

      <!-- Interactive Sandbox -->
      <section class="sandbox">
        <h2>Interface Lab</h2>
        <p>Try the interactions. Feel the "Squish".</p>

        <div class="sandbox-grid">
          <!-- Form Elements -->
          <div class="clay-card">
            <h3 style="margin-bottom: 1.5rem;">User Settings</h3>
            <form onsubmit="event.preventDefault()">
              <div style="margin-bottom: 1.5rem;">
                <label
                  style="display: block; margin-bottom: 0.5rem; font-weight: 700; margin-left: 10px;"
                  >Username</label
                >
                <input type="text" class="clay-input" placeholder="e.g. ClayMaster99" />
              </div>
              <div style="margin-bottom: 1.5rem;">
                <label
                  style="display: block; margin-bottom: 0.5rem; font-weight: 700; margin-left: 10px;"
                  >Email</label
                >
                <input type="email" class="clay-input" placeholder="hello@clay.design" />
              </div>
              <div
                style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;"
              >
                <span style="font-weight: 700; margin-left: 10px;">Notifications</span>
                <div class="clay-toggle" id="toggleDemo">
                  <div class="toggle-handle"></div>
                </div>
              </div>
              <button class="clay-btn btn-primary" style="width: 100%">Save Changes</button>
            </form>
          </div>

          <!-- Stats / Dashboard Widget (Non-heavy) -->
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div
              class="clay-card interactive"
              style="flex: 1; align-items: center; text-align: center; background-color: var(--accent-blue); color: #fff; border: none;"
            >
              <i data-lucide="trophy" size="48" style="margin-bottom: 1rem; opacity: 0.8"></i>
              <h2 style="color: #fff; margin: 0;">24.5 ETH</h2>
              <p style="color: rgba(255,255,255,0.8);">Total Volume</p>
            </div>

            <div
              class="clay-card interactive"
              style="flex: 1; flex-direction: row; align-items: center; justify-content: space-between;"
            >
              <div>
                <h3>Upload Asset</h3>
                <p style="margin: 0; font-size: 0.9rem;">Supports OBJ, GLB, PNG</p>
              </div>
              <button
                class="clay-btn"
                style="background: var(--bg-color); color: var(--text-main); padding: 1rem; border-radius: 50%;"
              >
                <i data-lucide="plus"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer
        style="margin-top: 5rem; text-align: center; padding-bottom: 2rem; color: var(--text-light);"
      >
        <p>&copy; 2024 Clay Design System. Make the web soft again.</p>
      </footer>
    </div>

    <script>
      // Initialize Icons
      lucide.createIcons();

      // Toggle Logic
      const toggle = document.getElementById("toggleDemo");
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");

        // Haptic feedback logic (Visual only)
        if (toggle.classList.contains("active")) {
          toggle.style.backgroundColor = "var(--clay-surface)";
        } else {
          toggle.style.backgroundColor = "var(--bg-color)";
        }
      });

      // Add subtle tilt effect to Hero shapes on mousemove
      document.addEventListener("mousemove", (e) => {
        const shapes = document.querySelectorAll(".shape");
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
          const speed = (index + 1) * 20;
          shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
      });
    </script>
  </body>
</html>
```
