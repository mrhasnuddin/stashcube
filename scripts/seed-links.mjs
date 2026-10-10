// Initial import from the two Notion pages ("Useful Link", "Inspo Website"), deduplicated.
// Row: [name, url, category, tags, subcategory?]
// Tracking params (ref=...) are stripped. Items the Notion pages listed twice appear once.
export const seed = [
  // Build / UI Libraries
  ['Cult UI', 'https://www.cult-ui.com/', 'ui-libraries', ['react', 'shadcn', 'tailwind', 'open-source']],
  ['React Bits', 'https://reactbits.dev/', 'ui-libraries', ['react', 'animation', 'open-source']],
  ['Aceternity UI', 'https://ui.aceternity.com/', 'ui-libraries', ['react', 'tailwind', 'animation']],
  ['daisyUI', 'https://daisyui.com/', 'ui-libraries', ['tailwind', 'themes', 'open-source']],
  ['Originkit', 'https://www.originkit.dev/', 'ui-libraries', ['animation', 'framer', 'mcp']],
  ['Watermelon UI', 'https://ui.watermelon.sh/home', 'ui-libraries', ['react', 'dashboards', 'blocks']],
  ['Vengeance UI', 'https://www.vengenceui.com/', 'ui-libraries', ['react', 'animation', 'landing-pages']],
  ['Canvas UI', 'https://canvasui.dev/components', 'ui-libraries', ['canvas', 'react', 'vue', 'svelte']],
  ['Beautiful UI', 'https://www.beautifului.dev/', 'ui-libraries', ['ai-ui', 'agents', 'copy-paste']],
  ['Oxygen UI', 'https://oxygen-ui.vercel.app/', 'ui-libraries', ['react', 'glass', 'micro-interactions']],
  ['Amicro', 'https://amicro.vercel.app/cards', 'ui-libraries', ['react', 'micro-interactions', 'transitions']],
  ['RewampUI', 'https://www.rewampui.com/', 'ui-libraries', ['react', 'showcase']],
  ['React Email', 'https://react.email/', 'ui-libraries', ['react', 'email', 'typescript']],

  // Build / Components
  ['Evil Charts', 'https://evilcharts.com/', 'components', ['react', 'charts', 'shadcn']],
  ['Component Gallery', 'https://component.gallery/', 'components', ['reference', 'design-systems']],
  ['Very Good Components', 'https://www.goodcomponents.io/', 'components', ['html', 'copy-paste']],
  ['Dot Matrix', 'https://dotmatrix.zzzzshawn.cloud/', 'components', ['react', 'loaders', 'shadcn']],
  ['Gradient Shimmer', 'https://gradient-shimmer.vercel.app/', 'components', ['react', 'text', 'animation']],
  ['slot-text', 'https://textmotion.dev/', 'components', ['text', 'animation', 'zero-deps']],
  ['Thinking Orbs', 'https://orbs.jakubantalik.com/', 'components', ['loaders', 'ai-ui', 'react']],
  ['Toggles', 'https://toggles.dev/', 'components', ['toggles', 'react']],
  ['Supahero', 'https://supahero.io/', 'components', ['hero', 'sections']],

  // Build / Icons
  ['Isocons', 'https://www.isocons.app/', 'icons', ['isometric', 'icons']],
  ['SVG Repo', 'https://www.svgrepo.com/', 'icons', ['svg', 'free', 'vectors']],
  ['Hugeicons', 'https://hugeicons.com/icons/stroke-rounded', 'icons', ['stroke', 'react', 'figma']],
  ['iconmonstr', 'https://iconmonstr.com/', 'icons', ['simple', 'free']],
  ['Streamline Free', 'https://www.streamlinehq.com/free', 'icons', ['png', 'svg', 'free']],
  ['Dashboard Icons', 'https://dashboardicons.com/', 'icons', ['apps', 'services', 'dashboards']],
  ['Its Hover', 'https://www.itshover.com/icons', 'icons', ['animated', 'react']],
  ['useAnimations', 'https://useanimations.com/index.html', 'icons', ['animated', 'lottie']],
  ['SVG Loaders', 'https://magecdn.com/tools/svg-loaders', 'icons', ['loaders', 'svg', 'free']],

  // Build / Fonts
  ['Font Brief', 'https://www.fontbrief.com/fontbrief', 'fonts', ['branding', 'editorial']],
  ['Font of Web', 'https://www.fontofweb.com/', 'fonts', ['inspiration', 'discovery']],
  ['Fonts In Use', 'https://fontsinuse.com/', 'fonts', ['archive', 'typography']],
  ['Best Free Fonts', 'https://bestfreefonts.com/', 'fonts', ['free', 'curated']],
  ['PP Neue Montreal', 'https://neuemontreal.com/', 'fonts', ['grotesque', 'sans']],
  ['Space Type Generator', 'https://spacetypegenerator.com/', 'fonts', ['kinetic', 'generator']],

  // Build / Templates
  ['VibeUI', 'https://www.vibeui.studio/', 'templates', ['ai-generated', 'ui']],
  ['Lander Studio Blocks', 'https://blocks.lander.studio/', 'templates', ['figma', 'free', 'sections']],
  ['Avande', 'https://collaborative-patterns-858685.framer.app/', 'templates', ['framer', 'ai-agency']],

  // Create / 3D Tools
  ['COBE', 'https://cobe.vercel.app/', '3d-tools', ['webgl', 'globe', 'lightweight']],
  ['Nacre', 'https://kaiba.world/', '3d-tools', ['hero', '3d', 'tool']],
  ['Morflax', 'https://morflax.com/products', '3d-tools', ['3d', 'mockups', 'motion']],
  ['AI Particle Simulator', 'https://particles.casberry.in/', '3d-tools', ['particles', 'webgl', 'ai']],

  // Create / Shaders and Effects
  ['ASCII Magic', 'https://www.ascii-magic.com/', 'shaders-effects', ['ascii', 'image', 'video']],
  ['Grainrad', 'https://grainrad.com/', 'shaders-effects', ['dither', 'webgpu', 'retro']],
  ['LUMEN', 'https://lumenshaders.vercel.app/', 'shaders-effects', ['shaders', 'generative', 'export']],
  ['Frakt', 'https://frakt.app/', 'shaders-effects', ['shaders', 'editor', 'export']],
  ['Shaders', 'https://shaders.com/', 'shaders-effects', ['webgpu', 'react', 'vue']],
  ['Paper Shaders', 'https://shaders.paper.design/', 'shaders-effects', ['glsl', 'react', 'zero-deps']],

  // Create / Colors and Gradients
  ['Colormind', 'http://colormind.io/', 'colors-gradients', ['palette', 'generator']],
  ['NEAT', 'https://neat.firecms.co/', 'colors-gradients', ['3d', 'animated', 'react']],
  ['ColorFlow', 'https://colorflow.ls.graphics/', 'colors-gradients', ['mesh', 'editor']],
  ['Aura Gradients', 'https://auragradients.vercel.app/', 'colors-gradients', ['gradients']],

  // Create / Illustration, Mockups
  ['SVG Shapes', 'https://www.shapes.gallery/', 'illustration', ['svg', 'shapes', 'copy-paste']],
  ['Mockups Design', 'https://mockups-design.com/', 'mockups', ['free', 'psd']],

  // Brand / Logos
  ['Logoinspo', 'https://www.logoinspo.com/', 'logos', ['symbol', 'wordmark', 'animated']],
  ['Logosystem', 'https://logosystem.co/', 'logos', ['inspiration']],
  ['Symbl', 'https://www.symbl.space/', 'logos', ['testing', 'tool']],

  // Brand / Design Systems
  ['UI Guideline', 'https://www.uiguideline.com/', 'design-systems', ['guides', 'figma', 'components']],
  ['Rebrand', 'https://www.rebrand.gallery/bentos', 'design-systems', ['brand', 'bento']],

  // Brand / Inspiration: galleries
  ['CTA Gallery', 'https://www.cta.gallery/', 'inspiration', ['cta', 'buttons'], 'galleries'],
  ['Best Designs on X', 'https://bestdesignsonx.com/', 'inspiration', ['x', 'curated'], 'galleries'],
  ['Lapa Ninja', 'https://www.lapa.ninja/', 'inspiration', ['landing-pages', 'saas'], 'galleries'],
  ['Design Spells', 'https://www.designspells.com/', 'inspiration', ['micro-interactions', 'details'], 'galleries'],
  ['Siteinspire', 'https://www.siteinspire.com/', 'inspiration', ['websites', 'curated'], 'galleries'],
  ['Curated Design', 'https://craftwork.design/curated/websites/', 'inspiration', ['websites', 'patterns'], 'galleries'],
  ['landing.love', 'https://www.landing.love/', 'inspiration', ['animation', 'video'], 'galleries'],
  ['Navbar Gallery', 'https://www.navbar.gallery/', 'inspiration', ['navigation'], 'galleries'],
  ['Maxi Best Of', 'https://maxibestof.one/', 'inspiration', ['weekly', 'typography'], 'galleries'],
  ['BentoGrids', 'https://bentogrids.com/', 'inspiration', ['bento', 'layouts'], 'galleries'],
  ['Netfolio', 'https://www.netfolio.io/websites', 'inspiration', ['websites', 'curated'], 'galleries'],
  ['Awwwards', 'https://www.awwwards.com/', 'inspiration', ['awards', 'websites'], 'galleries'],
  ['The Moving Poster', 'https://themovingposter.com/', 'inspiration', ['motion', 'posters'], 'galleries'],
  ['WebInspoo', 'https://www.webinspoo.com/', 'inspiration', ['saas', 'filters'], 'galleries'],
  ['Detail', 'https://detail.design/', 'inspiration', ['details', 'ai'], 'galleries'],
  ['Footer Design', 'https://www.footer.design/', 'inspiration', ['footers'], 'galleries'],
  ['60fps', 'https://60fps.design/', 'inspiration', ['animation', 'mobile'], 'galleries'],
  ['mesh3d', 'https://mesh3d.gallery/', 'inspiration', ['three.js', 'webgl'], 'galleries'],
  ['Minimal Gallery', 'https://minimal.gallery/', 'inspiration', ['minimal', 'daily'], 'galleries'],
  ['Cosmos', 'https://www.cosmos.so/', 'inspiration', ['moodboard'], 'galleries'],
  ['Branding Website', 'https://www.brandingwebsite.com/', 'inspiration', ['branding'], 'galleries'],
  ['Agency Gallery', 'https://agencygallery.com/', 'inspiration', ['agencies'], 'galleries'],
  ['Httpster', 'https://httpster.net/', 'inspiration', ['websites'], 'galleries'],
  ['nav.supply', 'https://nav.supply/', 'inspiration', ['navigation'], 'galleries'],
  ['Inspora', 'https://www.inspora.design/', 'inspiration', ['archive'], 'galleries'],

  // Brand / Inspiration: web3 and crypto
  ['Taiko', 'https://taiko.xyz/', 'inspiration', ['rollup', 'ethereum'], 'web3-crypto'],
  ['Shardeum', 'https://shardeum.instawp.xyz/', 'inspiration', ['layer-1'], 'web3-crypto'],
  ['EasyA', 'https://www.easya.io/', 'inspiration', ['learning'], 'web3-crypto'],
  ['Maverick Protocol', 'https://www.mav.xyz/', 'inspiration', ['defi', 'liquidity'], 'web3-crypto'],
  ['Manifold', 'https://manifold.xyz/', 'inspiration', ['nft', 'ethereum'], 'web3-crypto'],
  ['0G', 'https://0g.ai/', 'inspiration', ['ai', 'decentralized'], 'web3-crypto'],
  ['Bequant', 'https://www.bequant.com/', 'inspiration', ['networking', 'b2b'], 'saas-ai'],
  ['Tempo', 'https://tempo.xyz/', 'inspiration', ['payments', 'blockchain'], 'web3-crypto'],
  ['Dragonfly', 'https://www.dragonfly.xyz/', 'inspiration', ['investment', 'fund'], 'web3-crypto'],
  ['Solflare', 'https://www.solflare.com/', 'inspiration', ['wallet', 'solana'], 'web3-crypto'],
  ['Namada', 'https://namada.net/', 'inspiration', ['privacy', 'multichain'], 'web3-crypto'],
  ['Spark', 'https://spark.fi/', 'inspiration', ['defi', 'stablecoins'], 'web3-crypto'],
  ['Tenbin', 'https://tenbinlabs.xyz/', 'inspiration', ['tokenization'], 'web3-crypto'],
  ['DRiP', 'https://drip.haus/', 'inspiration', ['creators', 'solana'], 'web3-crypto'],
  ['Lvcidia Roadmap', 'https://roadmap.lvcidia.xyz/', 'inspiration', ['gaming', 'metaverse'], 'web3-crypto'],

  // Brand / Inspiration: studios and agencies
  ['Fantik Studio', 'https://fantik.studio/', 'inspiration', ['branding', 'motion'], 'studios-agencies'],
  ['Active Theory', 'https://activetheory.net/', 'inspiration', ['webgl', 'immersive'], 'studios-agencies'],
  ['Resn', 'https://resn.co.nz/', 'inspiration', ['creative', 'storytelling'], 'studios-agencies'],
  ['Lusion', 'https://lusion.co/', 'inspiration', ['3d', 'interactive'], 'studios-agencies'],
  ['Silencio', 'https://silencio.es/', 'inspiration', ['brands', 'design'], 'studios-agencies'],
  ['Dgrees', 'https://dgrees.studio/', 'inspiration', ['awards', 'web-design'], 'studios-agencies'],
  ['Noomo Agency', 'https://noomoagency.com/', 'inspiration', ['3d', 'storytelling'], 'studios-agencies'],
  ['Skarlo', 'https://skarlo.co/portfolio', 'inspiration', ['product-studio', 'ai'], 'studios-agencies'],
  ['Hype', 'https://www.hy.pe/', 'inspiration', ['crypto', 'agency'], 'studios-agencies'],
  ['Electra Filmworks', 'https://electrafilmworks.com/', 'inspiration', ['film', 'production'], 'studios-agencies'],
  ['M Studio Paris', 'https://www.mstudio-paris.com/en', 'inspiration', ['photo', 'studio'], 'studios-agencies'],

  // Brand / Inspiration: portfolios
  ['Jin Su Park', 'https://jinsupark.com/', 'inspiration', ['product-design'], 'portfolios'],
  ['Dmitrii Dark', 'https://ddark.dev/', 'inspiration', ['full-stack', 'technical-art'], 'portfolios'],
  ['Peter Oravec', 'https://peteroravec.com/', 'inspiration', ['front-end'], 'portfolios'],
  ['bokoko33', 'https://bokoko33.me/', 'inspiration', ['web', 'japan'], 'portfolios'],
  ['Ameen Abdullah', 'https://ameen-abdullah.dev/', 'inspiration', ['creative-dev', 'immersive'], 'portfolios'],
  ['Dorian Lods', 'https://www.dorianlods.com/', 'inspiration', ['webgl', 'design-engineer'], 'portfolios'],
  ['Matthew Yu', 'https://matthewyu.dev/', 'inspiration', ['art', 'film'], 'portfolios'],
  ['Jackie Zhang', 'https://jackiezhang.co.za/', 'inspiration', ['product-design'], 'portfolios'],

  // Brand / Inspiration: SaaS and AI
  ['Glaido', 'https://www.glaido.com/', 'inspiration', ['voice', 'saas'], 'saas-ai'],
  ['EternaCloud', 'https://www.eternacloud.com/', 'inspiration', ['b2b'], 'saas-ai'],
  ['Liveblocks', 'https://liveblocks.io/', 'inspiration', ['collaboration', 'devtools'], 'saas-ai'],
  ['Contra Rate Calculator', 'https://contra.com/project-rate-hiring-calculator/', 'inspiration', ['calculator'], 'saas-ai'],
  ['Greptile', 'https://www.greptile.com/', 'inspiration', ['code-review', 'ai'], 'saas-ai'],
  ['Maket Brand Kit', 'https://www.maket.ai/brand-kit', 'inspiration', ['brand-kit'], 'saas-ai'],
  ['illoca', 'https://illoca.com/', 'inspiration', ['ai', '3d'], 'saas-ai'],
  ['Soul', 'https://www.soul.io/', 'inspiration', ['saas'], 'saas-ai'],
  ['Space', 'https://spacefs.com/', 'inspiration', ['mac', 'storage'], 'saas-ai'],

  // Brand / Inspiration: other
  ['Sunmetalon', 'https://sunmetalon.com/', 'inspiration', ['industrial'], 'other'],
  ['fancy.design', 'https://fancy.design/', 'inspiration', ['design'], 'other'],
  ['KPR Story', 'https://kprverse.com/', 'inspiration', ['storytelling'], 'other'],

  // AI / Skills and DESIGN.md
  ['TypeUI', 'https://www.typeui.sh/design-skills', 'skills', ['design-skills', 'claude', 'codex']],
  ['Hue', 'https://hueapp.io/', 'skills', ['design-system', 'claude-code']],
  ['getdesign.md', 'https://getdesign.md/', 'skills', ['design-md', 'agents']],
  ['Refero Styles', 'https://styles.refero.design/', 'skills', ['design-md', 'search']],
  ['skills.sh', 'https://www.skills.sh/', 'skills', ['directory', 'agents']],
  ['designmd.supply', 'https://www.designmd.supply/', 'skills', ['design-md', 'generator']],
  ['UI Skills', 'https://www.ui-skills.com/', 'skills', ['design-engineers', 'directory']],
  ['Web Clone Skill', 'https://github.com/Jane-xiaoer/claude-skill-web-clone', 'skills', ['claude', 'cloning', 'github']],

  // AI / Prompts, MCP and Agents
  ['Design Prompts', 'https://www.designprompts.dev/', 'prompts', ['styles', 'ai']],
  ['Promptefy', 'https://www.promptefy.online/', 'prompts', ['video', 'ai']],
  ['Graphify', 'https://graphify.com/', 'mcp-agents', ['knowledge-graph', 'open-source']],
  ['VibeIndex', 'https://vibeindex.dev/', 'mcp-agents', ['directory', 'vibe-coding']],

  // Learn
  ['Toolcraft by Pixelpoint', 'https://pixelpoint.io/blog/how-to-craft-personal-design-tools-with-toolcraft/', 'articles', ['tools', 'blog']],
  ['Toolfolio', 'https://toolfolio.io/', 'tools', ['directory', 'productivity']],
  ['Design Resources', 'https://designresourc.es/', 'tools', ['curated', 'directory']],
  ['Design Engineer Tools', 'https://designengineer.tools/', 'tools', ['directory', 'design-engineering']],
  ['Diffusion Studio', 'https://diffusion.studio/', 'tools', ['video', 'editor']],
  ['NameThatUI', 'https://namethatui.com/', 'tools', ['reference', 'prompts']],
  ['Coolify', 'https://coolify.io/', 'tools', ['self-hosting', 'open-source']],
  ['Uppbeat SFX', 'https://uppbeat.io/sfx', 'tools', ['audio', 'free']],
  ['Kitbitz', 'https://kitbitz.art/', 'illustration', ['illustrations', 'free', 'hand-drawn']],
  ['Bencho', 'https://bencho.dev/', 'ui-libraries', ['blocks', 'interactive', 'copy-paste']],
  ['krypt.cc', 'https://krypt.cc/', 'tools', ['bio-pages']],
];
