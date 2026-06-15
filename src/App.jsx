import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Edit3,
  Eye,
  FileText,
  Film,
  LayoutDashboard,
  Link as LinkIcon,
  LockKeyhole,
  ListFilter,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

const STORAGE_KEY = "jx-literary-ip-platform-state";
const ADMIN_SESSION_KEY = "jx-literary-ip-platform-admin";
const ADMIN_PASSCODE = "jxwl2026";

const statusMap = {
  adapted: { label: "已改编", className: "status-adapted" },
  adapting: { label: "改编中", className: "status-adapting" },
  open: { label: "未改编", className: "status-open" },
};

const seedData = {
  works: [
    {
      id: "work-001",
      title: "赣江夜航",
      authorId: "author-001",
      genre: "现实题材",
      category: "长篇小说",
      words: "42万字",
      platform: "江西文联作品库",
      copyright: "版权清晰",
      status: "adapting",
      adaptationType: "网剧 / 短剧",
      scoreNote: "已进入影视开发沟通，适合都市现实题材剧集。",
      externalUrl: "https://example.com/serial/ganjiang",
      allowExternalUrl: false,
      summary:
        "以赣江沿岸城市更新为背景，讲述三代人在码头、老街与新城之间寻找自我价值的故事。",
      value:
        "人物关系集中，地域气质鲜明，现实议题清晰，具备中短剧开发空间。",
      tags: ["现实主义", "城市更新", "家族关系"],
      coverTone: "cyan",
      featured: true,
      special: "江西本土文学专期",
    },
    {
      id: "work-002",
      title: "瓷上春秋",
      authorId: "author-002",
      genre: "历史文化",
      category: "长篇小说",
      words: "36万字",
      platform: "省内文学期刊",
      copyright: "待核验",
      status: "open",
      adaptationType: "电影 / 电视剧",
      scoreNote: "尚未改编，建议先做版权梳理和影视提案包装。",
      externalUrl: "",
      allowExternalUrl: false,
      summary:
        "围绕景德镇匠人世家的传承与抉择展开，串联陶瓷工艺、商业变迁与个人命运。",
      value:
        "文化识别度高，视觉呈现空间强，适合打造具有地方文化质感的影视作品。",
      tags: ["非遗", "匠人", "历史"],
      coverTone: "orange",
      featured: true,
      special: "传统文化专期",
    },
    {
      id: "work-003",
      title: "山海来信",
      authorId: "author-003",
      genre: "青春成长",
      category: "网络文学",
      words: "58万字",
      platform: "网络连载平台",
      copyright: "版权清晰",
      status: "adapted",
      adaptationType: "短剧",
      scoreNote: "已完成短剧改编，平台累计播放表现良好。",
      externalUrl: "https://example.com/serial/shanhai",
      allowExternalUrl: true,
      summary:
        "大学毕业生回到山村参与乡村运营，在民宿、直播与文旅项目中重新理解故乡。",
      value:
        "年轻人物强，情绪轻快，兼具乡村振兴与青春创业表达。",
      tags: ["青春", "乡村振兴", "轻喜"],
      coverTone: "green",
      featured: true,
      special: "网络文学专期",
    },
    {
      id: "work-004",
      title: "雨巷旧案",
      authorId: "author-004",
      genre: "悬疑推理",
      category: "中篇小说",
      words: "18万字",
      platform: "江西文联作品库",
      copyright: "版权清晰",
      status: "open",
      adaptationType: "悬疑网剧",
      scoreNote: "未改编，适合开发 12 集以内悬疑单元剧。",
      externalUrl: "",
      allowExternalUrl: false,
      summary:
        "一桩二十年前的旧案在小城雨季重新浮出水面，记者与退休刑警共同追问真相。",
      value:
        "节奏紧凑，场景集中，案件线和人物线可并行推进。",
      tags: ["悬疑", "小城", "女性视角"],
      coverTone: "purple",
      featured: false,
      special: "类型文学专期",
    },
  ],
  authors: [
    {
      id: "author-001",
      name: "林向南",
      role: "江西省作协会员",
      direction: "现实题材、城市叙事",
      intro:
        "长期关注城市更新、家庭关系与普通人的职业变化，作品多发表于省内文学刊物。",
      awards: "入选省级重点文学扶持项目",
    },
    {
      id: "author-002",
      name: "周怀瓷",
      role: "文化题材作家",
      direction: "历史文化、非遗传承",
      intro:
        "深耕陶瓷文化与地方史叙事，擅长以家族故事承载时代变化。",
      awards: "获地方文化主题创作奖",
    },
    {
      id: "author-003",
      name: "许念",
      role: "网络文学作者",
      direction: "青春成长、轻喜剧",
      intro:
        "作品语言轻快，擅长青年群像、乡村文旅和互联网创业题材。",
      awards: "网络文学年度潜力作者",
    },
    {
      id: "author-004",
      name: "陈白桥",
      role: "悬疑小说作者",
      direction: "悬疑推理、社会派故事",
      intro:
        "以小城空间和现实情绪见长，作品注重案件背后的人物心理。",
      awards: "类型文学新锐奖",
    },
  ],
  conversions: [
    {
      id: "conversion-001",
      workId: "work-003",
      title: "《山海来信》短剧开发",
      type: "短剧",
      organization: "平台合作项目",
      stage: "已上线",
      result: "完成短剧改编，适合作为平台转化样板展示。",
      year: "2026",
    },
    {
      id: "conversion-002",
      workId: "work-001",
      title: "《赣江夜航》网剧孵化",
      type: "网剧",
      organization: "影视机构洽谈中",
      stage: "改编中",
      result: "已完成故事梗概和人物小传梳理。",
      year: "2026",
    },
  ],
  policies: [
    {
      id: "policy-001",
      title: "影视改编项目申报提示",
      type: "政策资讯",
      date: "2026-06-10",
      excerpt: "面向现实题材、地方文化题材和精品网络文学项目开放储备申报。",
    },
    {
      id: "policy-002",
      title: "文学 IP 影视化版权梳理指南",
      type: "版权服务",
      date: "2026-05-28",
      excerpt: "上线作品建议补充授权范围、改编权归属、连载平台信息和联系人。",
    },
    {
      id: "policy-003",
      title: "影视机构合作信息征集",
      type: "资源对接",
      date: "2026-05-18",
      excerpt: "征集制片机构、编剧团队、导演工作室与短剧制作团队合作信息。",
    },
  ],
  specials: [
    {
      id: "special-001",
      title: "江西本土文学专期",
      type: "作品专期",
      desc: "聚焦具有地域文化、现实表达和影视转化潜力的本土作品。",
      workIds: ["work-001", "work-002"],
    },
    {
      id: "special-002",
      title: "影视转化推荐专期",
      type: "影视专期",
      desc: "集中展示已改编、改编中和可快速进入提案包装的项目。",
      workIds: ["work-001", "work-003"],
    },
    {
      id: "special-003",
      title: "网络文学专期",
      type: "作品专期",
      desc: "筛选年轻读者基础较好、类型清晰、适合短剧和网剧开发的作品。",
      workIds: ["work-003", "work-004"],
    },
  ],
  filmResources: [
    {
      id: "resource-001",
      name: "影视机构资源库",
      count: "37 家",
      desc: "收录制片公司、短剧团队、宣发机构和地方拍摄服务资源。",
    },
    {
      id: "resource-002",
      name: "影视工作者联系库",
      count: "64 位",
      desc: "覆盖编剧、导演、制片、摄影、美术等合作角色，前台仅展示概览。",
    },
    {
      id: "resource-003",
      name: "政策扶持信息",
      count: "12 条",
      desc: "汇总影视拍摄、版权转化、文化产业扶持和项目申报动态。",
    },
  ],
};

const navItems = [
  { key: "home", label: "首页" },
  { key: "works", label: "作品库" },
  { key: "conversions", label: "转化成果" },
  { key: "specials", label: "专题" },
  { key: "film", label: "影视资源" },
  { key: "authors", label: "作家库" },
  { key: "policies", label: "政策资讯" },
];

function loadState() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : seedData;
  } catch {
    return seedData;
  }
}

function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [page = "home", id = ""] = hash.split("/");
  return { page, id };
}

function navigate(page, id = "") {
  window.location.hash = id ? `#/${page}/${id}` : `#/${page}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigateBack(fallbackPage) {
  const currentHash = window.location.hash;
  if (window.history.length > 1) {
    window.history.back();
    window.setTimeout(() => {
      if (window.location.hash === currentHash) navigate(fallbackPage);
    }, 120);
    return;
  }
  navigate(fallbackPage);
}

function App() {
  const [data, setData] = useState(loadState);
  const [route, setRoute] = useState(getRoute);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminUnlocked, setAdminUnlocked] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener("hashchange", syncRoute);
    if (!window.location.hash) navigate("home");
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const authorById = useMemo(
    () => Object.fromEntries(data.authors.map((author) => [author.id, author])),
    [data.authors],
  );

  const workById = useMemo(
    () => Object.fromEntries(data.works.map((work) => [work.id, work])),
    [data.works],
  );

  const filteredWorks = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return data.works.filter((work) => {
      const author = authorById[work.authorId]?.name ?? "";
      const matchesKeyword =
        !keyword ||
        [work.title, author, work.genre, work.category, work.summary, ...work.tags]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesStatus = statusFilter === "all" || work.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [authorById, data.works, query, statusFilter]);

  const updateWork = (work) => {
    setData((current) => ({
      ...current,
      works: current.works.some((item) => item.id === work.id)
        ? current.works.map((item) => (item.id === work.id ? work : item))
        : [work, ...current.works],
    }));
  };

  const updateAuthor = (author) => {
    setData((current) => ({
      ...current,
      authors: current.authors.some((item) => item.id === author.id)
        ? current.authors.map((item) => (item.id === author.id ? author : item))
        : [author, ...current.authors],
    }));
  };

  return (
    <div className={route.page === "admin" ? "site-shell admin-system" : "site-shell"}>
      {route.page !== "admin" && <Header activePage={route.page} />}
      <main>
        {route.page === "home" && (
          <HomePage
            data={data}
            authorById={authorById}
            workById={workById}
            query={query}
            setQuery={setQuery}
            setStatusFilter={setStatusFilter}
          />
        )}
        {route.page === "works" && (
          <WorksPage
            works={filteredWorks}
            authors={authorById}
            query={query}
            setQuery={setQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
        {route.page === "work" && (
          <WorkDetail
            work={workById[route.id]}
            author={authorById[workById[route.id]?.authorId]}
            conversions={data.conversions.filter((item) => item.workId === route.id)}
          />
        )}
        {route.page === "conversions" && (
          <ConversionsPage conversions={data.conversions} workById={workById} />
        )}
        {route.page === "authors" && (
          <AuthorsPage authors={data.authors} works={data.works} />
        )}
        {route.page === "author" && (
          <AuthorDetail
            author={authorById[route.id]}
            works={data.works.filter((work) => work.authorId === route.id)}
          />
        )}
        {route.page === "specials" && (
          <SpecialsPage specials={data.specials} workById={workById} />
        )}
        {route.page === "film" && (
          <FilmPage resources={data.filmResources} conversions={data.conversions} workById={workById} />
        )}
        {route.page === "policies" && <PoliciesPage policies={data.policies} />}
        {route.page === "admin" && (
          adminUnlocked ? (
            <AdminPage
              data={data}
              authorById={authorById}
              updateWork={updateWork}
              updateAuthor={updateAuthor}
              resetData={() => setData(seedData)}
              lockAdmin={() => {
                sessionStorage.removeItem(ADMIN_SESSION_KEY);
                setAdminUnlocked(false);
              }}
            />
          ) : (
            <AdminGate
              onUnlock={() => {
                sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
                setAdminUnlocked(true);
              }}
            />
          )
        )}
      </main>
      {route.page !== "admin" && <Footer />}
    </div>
  );
}

function Header({ activePage }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate("home")} type="button">
          <span className="brand-mark">赣</span>
          <span>
            <strong>江西文联</strong>
            <small>文学作品影视转化展示平台</small>
          </span>
        </button>
        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map((item) => (
            <button
              className={activePage === item.key ? "active" : ""}
              key={item.key}
              onClick={() => navigate(item.key)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HomePage({ data, authorById, workById, query, setQuery, setStatusFilter }) {
  const featured = data.works.filter((work) => work.featured);
  const adaptedCount = data.works.filter((work) => work.status === "adapted").length;
  const adaptingCount = data.works.filter((work) => work.status === "adapting").length;

  return (
    <>
      <section className="hero-section">
        <img className="hero-image" src="/images/hero-literature-film.png" alt="文学作品转化为影视画面的平台视觉" />
        <div className="hero-content">
          <p className="eyebrow">江右文脉 · 影视转化目录</p>
          <h1>江西文学 IP 转化展示平台</h1>
          <p className="hero-copy">
            像编辑部整理书目一样呈现作品、作家与改编线索：先看文学价值，再看转化状态，最后进入影视资源对接。
          </p>
          <SearchBar query={query} setQuery={setQuery} />
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate("works")} type="button">
              浏览作品库
              <ChevronRight size={18} />
            </button>
            <button className="ghost-btn" onClick={() => navigate("conversions")} type="button">
              查看转化成果
            </button>
          </div>
        </div>
      </section>

      <section className="metric-strip editorial-index">
        <Metric label="作品入库" value={`${data.works.length} 部`} />
        <Metric label="转化项目" value={`${data.conversions.length} 个`} />
        <Metric label="改编中" value={`${adaptingCount} 部`} />
        <Metric label="已有成果" value={`${adaptedCount} 部`} />
      </section>

      <section className="section-block">
        <SectionTitle
          eyebrow="分类入口"
          title="从题材进入作品目录"
          action="查看全部作品"
          onAction={() => navigate("works")}
        />
        <div className="category-grid">
          {[
            ["现实题材", "城市、家庭、产业和时代议题", "壹", "cyan"],
            ["历史文化", "地方文化、非遗、传统美学", "贰", "orange"],
            ["青春成长", "短剧、网剧友好的年轻表达", "叁", "green"],
            ["悬疑推理", "强情节、强节奏、类型开发", "肆", "purple"],
          ].map(([title, desc, index, tone]) => (
            <button
              className={`category-card tone-${tone}`}
              key={title}
              onClick={() => {
                setQuery(title);
                setStatusFilter("all");
                navigate("works");
              }}
              type="button"
            >
              <em>{index}</em>
              <strong>{title}</strong>
              <span>{desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle
          eyebrow="作品展示"
          title="本期编辑推荐"
          action="进入作品展示"
          onAction={() => navigate("works")}
        />
        <div className="shelf-showcase">
          <article className="editor-pick">
            <p>本期主推</p>
            <h3>{featured[0]?.title}</h3>
            <span>{featured[0]?.summary}</span>
            <small>改编备注：{featured[0]?.scoreNote}</small>
            <button className="primary-btn" onClick={() => navigate("work", featured[0]?.id)} type="button">
              查看作品详情
              <ChevronRight size={18} />
            </button>
          </article>
          <div className="book-grid compact">
            {featured.map((work) => (
              <WorkCard key={work.id} work={work} author={authorById[work.authorId]} />
            ))}
          </div>
        </div>
      </section>

      <section className="split-section">
        <div>
          <SectionTitle eyebrow="转化作品" title="从文本到影像的进度簿" />
          <div className="timeline-list">
            {data.conversions.map((item) => (
              <ConversionRow key={item.id} item={item} work={workById[item.workId]} />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="影视专期" title="影视资源案头索引" />
          <div className="resource-list">
            {data.filmResources.map((resource) => (
              <article className="resource-card" key={resource.id}>
                <strong>{resource.name}</strong>
                <span>{resource.count}</span>
                <p>{resource.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <label className="search-bar">
      <Search size={18} />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="搜索作品名、作家、题材、改编状态"
      />
    </label>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function SectionTitle({ eyebrow, title, action, onAction }) {
  return (
    <div className="section-title">
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-action" onClick={onAction} type="button">
          {action}
          <ArrowUpRight size={16} />
        </button>
      )}
    </div>
  );
}

function WorksPage({ works, authors, query, setQuery, statusFilter, setStatusFilter }) {
  return (
    <section className="page-wrap">
      <PageHero
        icon={BookOpen}
        title="作品展示"
        desc="以书城式卡片呈现文学作品，重点展示改编状态、题材、作家、版权与转化潜力。"
      />
      <div className="filter-bar">
        <SearchBar query={query} setQuery={setQuery} />
        <label className="select-filter">
          <ListFilter size={18} />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">全部状态</option>
            <option value="adapted">已改编</option>
            <option value="adapting">改编中</option>
            <option value="open">未改编</option>
          </select>
        </label>
      </div>
      <div className="book-grid">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} author={authors[work.authorId]} />
        ))}
      </div>
      {!works.length && <EmptyState text="暂无符合条件的作品" />}
    </section>
  );
}

function WorkCard({ work, author }) {
  const status = statusMap[work.status];

  return (
    <article className="work-card">
      <button className={`book-cover tone-${work.coverTone}`} onClick={() => navigate("work", work.id)} type="button">
        <span>{work.genre}</span>
        <strong>{work.title}</strong>
        <small>{author?.name}</small>
      </button>
      <div className="work-card-body">
        <div className="card-topline">
          <span className={`status-pill ${status.className}`}>{status.label}</span>
          <span>{work.category}</span>
        </div>
        <h3>{work.title}</h3>
        <p>{work.summary}</p>
        <div className="tag-row">
          {work.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <button className="detail-btn" onClick={() => navigate("work", work.id)} type="button">
          查看详情
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

function WorkDetail({ work, author, conversions }) {
  if (!work) return <MissingPage />;

  const status = statusMap[work.status];

  return (
    <section className="detail-wrap">
      <BackBar fallbackPage="works" />
      <div className="detail-main">
        <button className={`book-cover large tone-${work.coverTone}`} type="button">
          <span>{work.genre}</span>
          <strong>{work.title}</strong>
          <small>{author?.name}</small>
        </button>
        <article className="detail-info">
          <span className={`status-pill ${status.className}`}>{status.label}</span>
          <h1>{work.title}</h1>
          <p className="detail-lead">{work.summary}</p>
          <div className="meta-grid">
            <Meta label="作者" value={author?.name} icon={UserRound} />
            <Meta label="体裁" value={work.category} icon={BookOpen} />
            <Meta label="字数" value={work.words} icon={FileText} />
            <Meta label="首发/来源" value={work.platform} icon={LinkIcon} />
            <Meta label="版权状态" value={work.copyright} icon={ShieldCheck} />
            <Meta label="适配方向" value={work.adaptationType} icon={Film} />
          </div>
          <div className="detail-actions">
            <button className="primary-btn" type="button">
              版权咨询
              <ArrowUpRight size={18} />
            </button>
            {work.allowExternalUrl && work.externalUrl && (
              <a className="ghost-link" href={work.externalUrl} target="_blank" rel="noreferrer">
                连载平台链接
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </article>
      </div>

      <div className="detail-columns">
        <InfoPanel title="作品看点" icon={Sparkles}>
          <p>{work.value}</p>
          <div className="tag-row">
            {work.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </InfoPanel>
        <InfoPanel title="改编状态与成绩备注" icon={Clapperboard}>
          <p>{work.scoreNote}</p>
          <dl className="compact-list">
            <div>
              <dt>当前状态</dt>
              <dd>{status.label}</dd>
            </div>
            <div>
              <dt>建议形式</dt>
              <dd>{work.adaptationType}</dd>
            </div>
          </dl>
        </InfoPanel>
        <InfoPanel title="关联转化项目" icon={Film}>
          {conversions.length ? (
            conversions.map((item) => <ConversionRow key={item.id} item={item} work={work} compact />)
          ) : (
            <p>暂无公开转化项目，可在后台录入后展示。</p>
          )}
        </InfoPanel>
      </div>
    </section>
  );
}

function Meta({ label, value, icon: Icon }) {
  return (
    <div className="meta-item">
      <Icon size={17} />
      <span>{label}</span>
      <strong>{value || "待完善"}</strong>
    </div>
  );
}

function InfoPanel({ title, icon: Icon, children }) {
  return (
    <article className="info-panel">
      <h2>
        <Icon size={20} />
        {title}
      </h2>
      {children}
    </article>
  );
}

function ConversionsPage({ conversions, workById }) {
  return (
    <section className="page-wrap">
      <PageHero icon={Clapperboard} title="转化作品展示" desc="展示已改编、改编中和具备成果备注的文学 IP 项目。" />
      <div className="timeline-list wide">
        {conversions.map((item) => (
          <ConversionRow key={item.id} item={item} work={workById[item.workId]} />
        ))}
      </div>
    </section>
  );
}

function ConversionRow({ item, work, compact = false }) {
  return (
    <article className={`conversion-row ${compact ? "compact" : ""}`}>
      <div className="conversion-icon">
        <Film size={20} />
      </div>
      <div>
        <span>{item.year} · {item.type}</span>
        <h3>{item.title}</h3>
        <p>{item.result}</p>
        {!compact && work && (
          <button className="text-action" onClick={() => navigate("work", work.id)} type="button">
            原著：{work.title}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      <strong className="stage-pill">{item.stage}</strong>
    </article>
  );
}

function AuthorsPage({ authors, works }) {
  return (
    <section className="page-wrap">
      <PageHero icon={PenLine} title="作家库" desc="展示作家简介、创作方向、获奖信息和可转化作品。" />
      <div className="author-grid">
        {authors.map((author) => (
          <article className="author-card" key={author.id}>
            <div className="avatar">{author.name.slice(0, 1)}</div>
            <span>{author.role}</span>
            <h3>{author.name}</h3>
            <p>{author.intro}</p>
            <small>{works.filter((work) => work.authorId === author.id).length} 部作品入库</small>
            <button className="detail-btn" onClick={() => navigate("author", author.id)} type="button">
              查看作家详情
              <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuthorDetail({ author, works }) {
  if (!author) return <MissingPage />;

  return (
    <section className="detail-wrap">
      <BackBar fallbackPage="authors" />
      <div className="author-profile">
        <div className="avatar large">{author.name.slice(0, 1)}</div>
        <div>
          <p className="eyebrow">{author.role}</p>
          <h1>{author.name}</h1>
          <p>{author.intro}</p>
        </div>
      </div>
      <div className="detail-columns">
        <InfoPanel title="创作方向" icon={Edit3}>
          <p>{author.direction}</p>
        </InfoPanel>
        <InfoPanel title="奖项与经历" icon={Star}>
          <p>{author.awards}</p>
        </InfoPanel>
        <InfoPanel title="代表作品" icon={BookOpen}>
          <div className="mini-work-list">
            {works.map((work) => (
              <button key={work.id} onClick={() => navigate("work", work.id)} type="button">
                {work.title}
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </InfoPanel>
      </div>
    </section>
  );
}

function BackBar({ fallbackPage }) {
  return (
    <div className="back-bar">
      <button onClick={() => navigateBack(fallbackPage)} type="button">
        <ArrowLeft size={16} />
        返回上一级
      </button>
    </div>
  );
}

function SpecialsPage({ specials, workById }) {
  return (
    <section className="page-wrap">
      <PageHero icon={Sparkles} title="作品专期" desc="通过专题运营包装重点题材、重点作家和重点转化方向。" />
      <div className="special-grid">
        {specials.map((special) => (
          <article className="special-card" key={special.id}>
            <span>{special.type}</span>
            <h3>{special.title}</h3>
            <p>{special.desc}</p>
            <div className="mini-work-list">
              {special.workIds.map((id) => (
                <button key={id} onClick={() => navigate("work", id)} type="button">
                  {workById[id]?.title}
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FilmPage({ resources, conversions, workById }) {
  return (
    <section className="page-wrap">
      <PageHero icon={Film} title="影视专期" desc="承载影视工作者、影视机构联系方式、政策扶持和转化项目概览。" />
      <div className="resource-list grid">
        {resources.map((resource) => (
          <article className="resource-card" key={resource.id}>
            <Building2 size={22} />
            <strong>{resource.name}</strong>
            <span>{resource.count}</span>
            <p>{resource.desc}</p>
          </article>
        ))}
      </div>
      <SectionTitle eyebrow="项目进度" title="影视转化成果" />
      <div className="timeline-list wide">
        {conversions.map((item) => (
          <ConversionRow key={item.id} item={item} work={workById[item.workId]} />
        ))}
      </div>
    </section>
  );
}

function PoliciesPage({ policies }) {
  return (
    <section className="page-wrap">
      <PageHero icon={CalendarDays} title="政策资讯" desc="集中展示影视政策、版权服务、产业扶持和资源对接信息。" />
      <div className="policy-list">
        {policies.map((policy) => (
          <article className="policy-row" key={policy.id}>
            <span>{policy.type}</span>
            <h3>{policy.title}</h3>
            <p>{policy.excerpt}</p>
            <time>{policy.date}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageHero({ icon: Icon, title, desc }) {
  return (
    <div className="page-hero">
      <Icon size={28} />
      <div>
        <p className="eyebrow">江西文联</p>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function AdminGate({ onUnlock }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setError("");
      onUnlock();
      return;
    }
    setError("维护口令不正确，请联系平台管理员。");
  };

  return (
    <section className="admin-gate">
      <div className="gate-card">
        <span className="gate-icon">
          <LockKeyhole size={28} />
        </span>
        <p className="eyebrow">内容运营系统</p>
        <h1>运营后台仅限授权人员</h1>
        <p>
          展示端只呈现已发布内容；作品录入、改编状态、成绩备注、数据统计和跳转配置应在独立运营系统中维护。
        </p>
        <form onSubmit={submit}>
          <label>
            维护口令
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              placeholder="请输入维护口令"
            />
          </label>
          {error && <span className="form-error">{error}</span>}
          <button className="primary-btn" type="submit">
            进入后台
          </button>
        </form>
      </div>
    </section>
  );
}

function AdminPage({ data, authorById, updateWork, updateAuthor, resetData, lockAdmin }) {
  const [tab, setTab] = useState("works");
  const [selectedWorkId, setSelectedWorkId] = useState(data.works[0]?.id ?? "");
  const [selectedAuthorId, setSelectedAuthorId] = useState(data.authors[0]?.id ?? "");

  const selectedWork = data.works.find((work) => work.id === selectedWorkId) ?? data.works[0];
  const selectedAuthor = data.authors.find((author) => author.id === selectedAuthorId) ?? data.authors[0];

  return (
    <section className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <LayoutDashboard size={24} />
          <h1>运营维护后台</h1>
          <p>演示版使用浏览器本地保存，后续可替换为数据库和权限系统。</p>
        </div>
        <button className={tab === "works" ? "active" : ""} onClick={() => setTab("works")} type="button">
          <BookOpen size={18} />
          作品管理
        </button>
        <button className={tab === "authors" ? "active" : ""} onClick={() => setTab("authors")} type="button">
          <UserRound size={18} />
          作家管理
        </button>
        <button className={tab === "ops" ? "active" : ""} onClick={() => setTab("ops")} type="button">
          <ShieldCheck size={18} />
          运营配置
        </button>
        <button onClick={lockAdmin} type="button">
          <LockKeyhole size={18} />
          退出后台
        </button>
        <button className="reset-btn" onClick={resetData} type="button">
          恢复示例数据
        </button>
      </aside>

      <div className="admin-content">
        {tab === "works" && selectedWork && (
          <WorkEditor
            works={data.works}
            authors={data.authors}
            authorById={authorById}
            selectedWork={selectedWork}
            selectedWorkId={selectedWorkId}
            setSelectedWorkId={setSelectedWorkId}
            updateWork={updateWork}
          />
        )}
        {tab === "authors" && selectedAuthor && (
          <AuthorEditor
            authors={data.authors}
            selectedAuthor={selectedAuthor}
            selectedAuthorId={selectedAuthorId}
            setSelectedAuthorId={setSelectedAuthorId}
            updateAuthor={updateAuthor}
          />
        )}
        {tab === "ops" && <OpsPanel data={data} />}
      </div>
    </section>
  );
}

function WorkEditor({ works, authors, authorById, selectedWork, selectedWorkId, setSelectedWorkId, updateWork }) {
  const [draft, setDraft] = useState(selectedWork);

  useEffect(() => {
    setDraft(selectedWork);
  }, [selectedWork]);

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const save = (event) => {
    event.preventDefault();
    updateWork({
      ...draft,
      tags: Array.isArray(draft.tags)
        ? draft.tags
        : String(draft.tags)
            .split(/[，,]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
    });
  };

  const createNew = () => {
    const id = `work-${Date.now()}`;
    const next = {
      ...seedData.works[0],
      id,
      title: "新作品",
      authorId: authors[0]?.id,
      status: "open",
      scoreNote: "待录入改编成绩备注。",
      tags: ["待分类"],
      featured: false,
      allowExternalUrl: false,
    };
    updateWork(next);
    setSelectedWorkId(id);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">作品管理</p>
          <h2>详情信息与改编状态录入</h2>
        </div>
        <button className="primary-btn" onClick={createNew} type="button">
          新增作品
        </button>
      </div>

      <div className="admin-split">
        <div className="record-list">
          {works.map((work) => (
            <button
              className={selectedWorkId === work.id ? "active" : ""}
              key={work.id}
              onClick={() => setSelectedWorkId(work.id)}
              type="button"
            >
              <strong>{work.title}</strong>
              <span>{authorById[work.authorId]?.name} · {statusMap[work.status].label}</span>
            </button>
          ))}
        </div>

        <form className="editor-form" onSubmit={save}>
          <label>
            作品名称
            <input value={draft.title} onChange={(event) => setField("title", event.target.value)} />
          </label>
          <div className="form-grid">
            <label>
              作者
              <select value={draft.authorId} onChange={(event) => setField("authorId", event.target.value)}>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </label>
            <label>
              改编状态
              <select value={draft.status} onChange={(event) => setField("status", event.target.value)}>
                <option value="adapted">已改编</option>
                <option value="adapting">改编中</option>
                <option value="open">未改编</option>
              </select>
            </label>
            <label>
              题材
              <input value={draft.genre} onChange={(event) => setField("genre", event.target.value)} />
            </label>
            <label>
              体裁
              <input value={draft.category} onChange={(event) => setField("category", event.target.value)} />
            </label>
            <label>
              字数
              <input value={draft.words} onChange={(event) => setField("words", event.target.value)} />
            </label>
            <label>
              版权状态
              <input value={draft.copyright} onChange={(event) => setField("copyright", event.target.value)} />
            </label>
          </div>
          <label>
            作品简介
            <textarea value={draft.summary} onChange={(event) => setField("summary", event.target.value)} rows={4} />
          </label>
          <label>
            改编成绩备注
            <textarea value={draft.scoreNote} onChange={(event) => setField("scoreNote", event.target.value)} rows={3} />
          </label>
          <label>
            转化价值说明
            <textarea value={draft.value} onChange={(event) => setField("value", event.target.value)} rows={3} />
          </label>
          <div className="form-grid">
            <label>
              适配方向
              <input value={draft.adaptationType} onChange={(event) => setField("adaptationType", event.target.value)} />
            </label>
            <label>
              外部连载链接
              <input value={draft.externalUrl} onChange={(event) => setField("externalUrl", event.target.value)} />
            </label>
          </div>
          <div className="switch-row">
            <label>
              <input
                type="checkbox"
                checked={draft.allowExternalUrl}
                onChange={(event) => setField("allowExternalUrl", event.target.checked)}
              />
              前台显示连载平台跳转
            </label>
            <label>
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => setField("featured", event.target.checked)}
              />
              首页推荐
            </label>
          </div>
          <button className="primary-btn" type="submit">保存作品信息</button>
        </form>
      </div>
    </div>
  );
}

function AuthorEditor({ authors, selectedAuthor, selectedAuthorId, setSelectedAuthorId, updateAuthor }) {
  const [draft, setDraft] = useState(selectedAuthor);

  useEffect(() => {
    setDraft(selectedAuthor);
  }, [selectedAuthor]);

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const createNew = () => {
    const id = `author-${Date.now()}`;
    const next = {
      id,
      name: "新作家",
      role: "待完善",
      direction: "待完善",
      intro: "请录入作家简介。",
      awards: "待完善",
    };
    updateAuthor(next);
    setSelectedAuthorId(id);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">作家管理</p>
          <h2>作家详情页基础资料</h2>
        </div>
        <button className="primary-btn" onClick={createNew} type="button">新增作家</button>
      </div>
      <div className="admin-split">
        <div className="record-list">
          {authors.map((author) => (
            <button
              className={selectedAuthorId === author.id ? "active" : ""}
              key={author.id}
              onClick={() => setSelectedAuthorId(author.id)}
              type="button"
            >
              <strong>{author.name}</strong>
              <span>{author.role}</span>
            </button>
          ))}
        </div>
        <form
          className="editor-form"
          onSubmit={(event) => {
            event.preventDefault();
            updateAuthor(draft);
          }}
        >
          <label>
            作家姓名
            <input value={draft.name} onChange={(event) => setField("name", event.target.value)} />
          </label>
          <label>
            身份/头衔
            <input value={draft.role} onChange={(event) => setField("role", event.target.value)} />
          </label>
          <label>
            创作方向
            <input value={draft.direction} onChange={(event) => setField("direction", event.target.value)} />
          </label>
          <label>
            作家简介
            <textarea value={draft.intro} onChange={(event) => setField("intro", event.target.value)} rows={5} />
          </label>
          <label>
            获奖经历
            <textarea value={draft.awards} onChange={(event) => setField("awards", event.target.value)} rows={3} />
          </label>
          <button className="primary-btn" type="submit">保存作家信息</button>
        </form>
      </div>
    </div>
  );
}

function OpsPanel({ data }) {
  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">运营配置</p>
          <h2>当前 MVP 已覆盖模块</h2>
        </div>
      </div>
      <div className="ops-grid">
        {[
          ["作品展示", `${data.works.length} 部作品，支持状态筛选和详情页`],
          ["转化作品", `${data.conversions.length} 个转化项目，关联原著`],
          ["作品专期", `${data.specials.length} 个专题，可扩展 Banner 和排序`],
          ["影视专期", `${data.filmResources.length} 类影视资源入口`],
          ["版权标注", "全站页脚已添加指定支持单位文案"],
          ["跳转控制", "后台可设置是否展示连载平台外链"],
        ].map(([title, desc]) => (
          <article className="ops-card" key={title}>
            <ShieldCheck size={20} />
            <strong>{title}</strong>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <Eye size={24} />
      <p>{text}</p>
    </div>
  );
}

function MissingPage() {
  return (
    <section className="page-wrap">
      <EmptyState text="页面不存在或内容尚未录入" />
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>江西文联文学作品影视转化展示平台</strong>
        <p>作品展示、转化项目、作家资料、影视资源与政策资讯。</p>
      </div>
      <div className="footer-meta">
        <p className="copyright">九州转化平台提供支持｜支持单位：九州文化</p>
      </div>
    </footer>
  );
}

export default App;
