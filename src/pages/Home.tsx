import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, Container, Logo, LockIcon } from "../components/ui";
import { OFFERS, STORE, kitUnitCents, savingsCents } from "../config";
import { brl } from "../lib/format";

const UNIT = OFFERS.unitario;
const KIT = OFFERS["kit-duplo"];

const PHOTOS = [
  { src: "/images/frente.webp", w: 1254, h: 1254, alt: "Orbe Gel — Super M4 Blaster que lança esferas de gel, com embalagem" },
  { src: "/images/produto.webp", w: 1000, h: 997, alt: "Super M4 Blaster verde e branca ao lado da embalagem" },
  { src: "/images/closeup.webp", w: 1000, h: 998, alt: "Detalhe do cano, da mira e do tambor" },
  { src: "/images/detalhe.webp", w: 998, h: 1000, alt: "Super M4 Blaster sobre deck de madeira" },
  { src: "/images/kit.webp", w: 989, h: 1000, alt: "Embalagem com blaster, óculos de proteção e bolinhas de gel" },
  { src: "/images/uso.webp", w: 1000, h: 765, alt: "Super M4 Blaster sendo segurada em dois ângulos" },
];

const SPECS: [string, string][] = [
  ["Produto", "Super M4 Blaster Elétrica de Gel"],
  ["Tipo de disparo", "Automático, elétrico"],
  ["Carregador", "Tambor"],
  ["Cores", "Verde e branco"],
  ["Munição", "Bolinhas de gel hidratadas (7 a 8 mm)"],
  ["Idade indicada", `${STORE.minAge} anos, conforme a embalagem`],
  ["Na oferta", "1 blaster, 1 par de óculos de proteção e 1 sachê de bolinhas de gel"],
];

const SAFETY = [
  "Use sempre os óculos de proteção durante a brincadeira.",
  "Nunca mire nos olhos ou no rosto.",
  "Brinque em local apropriado e combine as regras antes de começar.",
  `Respeite a faixa etária da embalagem (${STORE.minAge}).`,
  "Mantenha o produto e as bolinhas longe de crianças pequenas.",
];

const FAQ = [
  ["Quanto custa?", `Uma unidade custa ${brl(UNIT.priceCents)}. O kit com duas sai por ${brl(KIT.priceCents)} (${brl(kitUnitCents)} cada).`],
  ["Como posso pagar?", "Por PIX, dentro do próprio site. O pedido é confirmado assim que o pagamento é compensado."],
  ["O produto é automático?", "Sim, o disparo é elétrico e automático."],
  ["O que vem na caixa?", "Uma blaster, um par de óculos de proteção e um sachê de bolinhas de gel. Confira o conteúdo informado antes de finalizar a compra."],
  ["Qual é o prazo de entrega?", "O prazo e as condições de envio aparecem durante a compra, de acordo com a sua região."],
  ["Qual é a idade recomendada?", `A embalagem indica ${STORE.minAge} anos. Siga sempre a faixa etária do fabricante.`],
];

const TRUST = [
  { t: "Compra segura", s: "Pagamento por PIX no site", d: "M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6l8-3zM8.5 12l2.5 2.5L15.5 10" },
  { t: "Entrega via Correios", s: "PAC ou SEDEX", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" },
  { t: "Código de rastreamento", s: "Acompanhe seu pedido", d: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
  { t: "Disparo automático", s: "Tambor de alta capacidade", d: "M13 2L4 14h7l-1 8 9-12h-7l1-8z" },
];

function Icon({ d, className = "h-6 w-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Cta({ to, href, children, className = "" }: { to?: string; href?: string; children: React.ReactNode; className?: string }) {
  const cls = `group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-lime to-brand px-6 py-4 text-center text-base font-extrabold uppercase tracking-wide text-night shadow-[0_8px_24px_-6px_rgba(139,213,0,.55)] transition hover:brightness-110 active:scale-[.99] ${className}`;
  return to ? <Link to={to} className={cls}>{children}</Link> : <a href={href} className={cls}>{children}</a>;
}

function Title({ kicker, title, sub, light = false }: { kicker?: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className="text-center">
      {kicker && <p className="text-xs font-extrabold uppercase tracking-[.2em] text-brand">{kicker}</p>}
      <h2 className={`font-display mt-1 text-3xl font-extrabold uppercase italic leading-none sm:text-4xl ${light ? "text-white" : "text-forest"}`}>{title}</h2>
      {sub && <p className={`mx-auto mt-2 max-w-md text-sm ${light ? "text-white/70" : "text-ink/65"}`}>{sub}</p>}
      <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-lime to-brand" />
    </div>
  );
}

function Gallery() {
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const [h, setH] = useState<number>();

  // A altura da galeria acompanha a foto que está na tela (sem espaço em branco)
  const measure = useCallback(() => {
    const el = slides.current[i];
    if (el) setH(el.offsetHeight);
  }, [i]);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    slides.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [measure]);

  // Atualiza o contador conforme a pessoa arrasta a foto com o dedo
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const n = Math.round(el.scrollLeft / el.clientWidth);
    if (n !== i) setI(Math.max(0, Math.min(PHOTOS.length - 1, n)));
  };
  const goTo = (n: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="md:flex md:flex-row-reverse md:gap-3">
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,.7)] ring-1 ring-lime/40">
        <div ref={track} onScroll={onScroll} style={h ? { height: h } : undefined}
          className="no-scrollbar flex snap-x snap-mandatory items-start overflow-x-auto overflow-y-hidden overscroll-x-contain transition-[height] duration-200">
          {PHOTOS.map((p, n) => (
            <div key={p.src} ref={(el) => { slides.current[n] = el; }} className="w-full shrink-0 snap-center snap-always">
              <img
                src={p.src} alt={p.alt} width={p.w} height={p.h}
                fetchPriority={n === 0 ? "high" : "auto"} loading={n === 0 ? "eager" : "lazy"} draggable={false}
                className="mx-auto block max-h-[78svh] w-full object-contain md:max-h-[600px]"
              />
            </div>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-night/70 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur">{i + 1}/{PHOTOS.length}</span>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto py-3 md:flex-col md:overflow-visible md:py-0">
        {PHOTOS.map((t, n) => (
          <button
            key={t.src} onClick={() => goTo(n)} aria-label={`Ver foto ${n + 1}`} aria-current={n === i}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition md:h-16 md:w-16 ${n === i ? "border-lime" : "border-white/20 opacity-80"}`}
          >
            <img src={t.src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-16 py-10 sm:py-14 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export default function Home() {
  const [offersVisible, setOffersVisible] = useState(false);
  // Meta Pixel: visualização do produto
  useEffect(() => {
    (window as any).fbq?.("track", "ViewContent", {
      content_name: OFFERS.unitario.name,
      content_type: "product",
      value: OFFERS.unitario.priceCents / 100,
      currency: "BRL",
    });
  }, []);
  useEffect(() => {
    const el = document.getElementById("ofertas");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffersVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="bg-lime py-1.5 text-center text-xs font-bold uppercase tracking-wide text-night">
        Entrega via Correios · Pagamento por PIX direto no site
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-night/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Logo className="h-12" />
          <a href="#ofertas" className="rounded-lg bg-lime px-4 py-2 text-sm font-extrabold uppercase text-night hover:brightness-110">Ver ofertas</a>
        </Container>
      </header>

      <main className="pb-20 md:pb-0">
        {/* PRODUTO (primeira dobra) */}
        <div className="relative overflow-hidden bg-night">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_0%,rgba(139,213,0,.22),transparent),radial-gradient(50%_40%_at_100%_100%,rgba(25,163,54,.25),transparent)]" />
          <div className="relative mx-auto max-w-6xl px-3 pb-10 pt-4 md:px-6 md:pb-14 md:pt-8">
            <div className="md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start md:gap-10">
              <Gallery />
              <div className="px-1 pt-4 text-white md:p-0">
                <p className="inline-block rounded-full border border-lime/50 bg-lime/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime">Novo · Lançador de gel elétrico</p>
                <h1 className="font-display mt-3 text-4xl font-extrabold uppercase italic leading-[.95] sm:text-5xl">
                  Super M4 Blaster <span className="text-lime">Elétrica de Gel</span> Automática
                </h1>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.06] p-4 backdrop-blur">
                  <p className="text-sm text-white/65">A partir de</p>
                  <p className="font-display text-6xl font-extrabold leading-none text-lime">{brl(UNIT.priceCents)}</p>
                  <p className="mt-1.5 text-sm text-white/80">no PIX, pagamento direto no site</p>
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-lime/15 px-3 py-2.5 text-sm ring-1 ring-lime/40">
                    <div>
                      <p className="font-bold text-white">Kit com 2 blasters: {brl(KIT.priceCents)}</p>
                      <p className="text-white/70">{brl(kitUnitCents)} cada · você economiza {brl(savingsCents)}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-lime px-2 py-1 text-[11px] font-extrabold uppercase text-night">Melhor preço</span>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm text-white/90">
                  {["Disparo automático e tambor de alta capacidade", "Óculos de proteção e bolinhas de gel na oferta", "Idade indicada na embalagem: " + STORE.minAge].map((t) => (
                    <li key={t} className="flex gap-2.5"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-lime" />{t}</li>
                  ))}
                </ul>

                <Cta href="#ofertas" className="mt-6 w-full">Quero a minha</Cta>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/60"><LockIcon className="h-3.5 w-3.5" /> Compra segura. Frete e prazo informados no pedido.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CONFIANÇA */}
        <div className="bg-forest">
          <Container className="grid grid-cols-2 gap-px py-5 md:grid-cols-4 md:gap-4">
            {TRUST.map((x) => (
              <div key={x.t} className="flex items-center gap-3 px-2 py-2 text-white">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime ring-1 ring-lime/40"><Icon d={x.d} className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-tight sm:text-sm">{x.t}</p>
                  <p className="text-[11px] leading-tight text-white/65 sm:text-xs">{x.s}</p>
                </div>
              </div>
            ))}
          </Container>
        </div>

        {/* DESCRIÇÃO DO PRODUTO */}
        <Section className="bg-night">
          <Title kicker="Conheça o produto" title="Descrição do produto" light />
          <div className="mx-auto mt-7 max-w-[560px] overflow-hidden rounded-2xl ring-1 ring-lime/40 shadow-[0_30px_80px_-30px_rgba(139,213,0,.35)]">
            <img
              src="/images/descricao.webp" width={768} height={2048} loading="lazy"
              alt="Orbe Gel Super M4 Blaster: lança esferas de gel, disparo automático, carregador de alta capacidade, design ergonômico e dicas de segurança"
              className="block h-auto w-full"
            />
          </div>
          <div className="mx-auto mt-6 max-w-[560px]">
            <Cta href="#ofertas" className="w-full">Ver ofertas</Cta>
          </div>
        </Section>

        {/* ENTREGA */}
        <Section className="bg-forest !py-8 sm:!py-12">
          <img
            src="/images/correios-banner.webp" width={723} height={587} loading="lazy"
            alt="Entrega via Correios com código de rastreamento. Garantia de compra segura, entrega rápida e segura, compra 100% segura"
            className="mx-auto block h-auto w-full max-w-[640px] rounded-2xl ring-1 ring-lime/40"
          />
        </Section>

        {/* OFERTAS */}
        <Section id="ofertas" className="bg-mint">
          <Title kicker="Escolha seu kit" title="Escolha sua oferta" sub="Pagamento por PIX, direto no site." />
          <div className="mx-auto mt-8 grid max-w-3xl gap-5 md:grid-cols-2">
            {[
              { o: UNIT, note: "Uma unidade para começar.", extra: null as string | null, best: false },
              { o: KIT, note: "Duas blasters para jogar em dupla.", extra: `${brl(kitUnitCents)} cada · economize ${brl(savingsCents)}`, best: true },
            ].map(({ o, note, extra, best }) => (
              <article key={o.id} className={`relative flex flex-col rounded-2xl bg-white p-5 shadow-sm ${best ? "ring-2 ring-brand shadow-[0_20px_50px_-20px_rgba(25,163,54,.6)]" : "ring-1 ring-line"}`}>
                {best && <p className="absolute -top-3 left-4 rounded-full bg-gradient-to-r from-lime to-brand px-3 py-1 text-xs font-extrabold uppercase text-night">Mais vantajoso</p>}
                <div className="flex gap-4">
                  <img src="/images/frente.webp" alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-xl border border-line object-cover" />
                  <div>
                    <h3 className="font-bold leading-snug text-forest">{o.name}</h3>
                    <p className="mt-0.5 text-sm text-ink/65">{note}</p>
                  </div>
                </div>
                <p className="font-display mt-5 text-5xl font-extrabold leading-none text-forest">{brl(o.priceCents)}</p>
                <p className="mt-1 min-h-5 text-sm font-medium text-brand-dark">{extra ?? "no PIX"}</p>
                <Cta to={`/checkout/${o.id}`} className="mt-4 w-full">Comprar {o.qty === 1 ? "1 unidade" : "kit com 2"}</Cta>
              </article>
            ))}
          </div>
          <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink/70">
            {["1 Super M4 Blaster elétrica de gel", "1 par de óculos de proteção", "1 sachê de bolinhas de gel"].map((t) => (
              <li key={t} className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-brand" />{t}</li>
            ))}
          </ul>
          <p className="mt-2 text-center text-xs text-ink/50">Imagens ilustrativas. Confira o conteúdo informado antes de finalizar a compra.</p>
        </Section>

        {/* MUNIÇÃO + ESPECIFICAÇÕES */}
        <Section className="bg-white">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase italic text-forest sm:text-3xl">Como preparar a munição</h2>
              <span className="mt-2 block h-1 w-14 rounded-full bg-gradient-to-r from-lime to-brand" />
              <p className="mt-4 text-sm leading-relaxed text-ink/80">
                As bolinhas vêm secas, como cristais de gel. Deixe-as em água limpa por algumas horas, até chegarem a cerca de 7–8 mm. Depois é só carregar o tambor.
              </p>
              <p className="mt-2 text-xs text-ink/55">Siga sempre as instruções do fabricante.</p>
              <img src="/images/municao.webp" alt="Cristais de gel hidratando em água até formarem as bolinhas" loading="lazy" className="mt-5 w-full max-w-xs rounded-xl border border-line" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold uppercase italic text-forest sm:text-3xl">Especificações</h2>
              <span className="mt-2 block h-1 w-14 rounded-full bg-gradient-to-r from-lime to-brand" />
              <dl className="mt-4 overflow-hidden rounded-xl border border-line text-sm">
                {SPECS.map(([k, v], n) => (
                  <div key={k} className={`grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] ${n % 2 ? "bg-white" : "bg-mint"}`}>
                    <dt className="px-4 py-2.5 font-semibold text-forest">{k}</dt>
                    <dd className="px-4 py-2.5 text-ink/80">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>

        {/* SEGURANÇA */}
        <Section className="bg-forest !py-10">
          <Title title="Segurança em primeiro lugar" light />
          <ul className="mx-auto mt-6 grid max-w-3xl gap-3 text-sm text-white/90 sm:grid-cols-2">
            {SAFETY.map((t) => (
              <li key={t} className="flex gap-2.5 rounded-xl bg-white/[.06] p-3 ring-1 ring-white/10"><CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-lime" />{t}</li>
            ))}
          </ul>
        </Section>

        {/* FAQ */}
        <Section className="bg-mint">
          <Title title="Perguntas frequentes" />
          <div className="mx-auto mt-6 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group px-4 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-forest sm:text-base">
                  {q}<span className="text-2xl leading-none text-brand transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-sm text-ink/75">{a}</p>
              </details>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <Cta href="#ofertas" className="w-full">Voltar às ofertas</Cta>
          </div>
        </Section>
      </main>

      {/* BARRA FIXA MOBILE */}
      <div className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-night/95 p-3 backdrop-blur transition-transform md:hidden ${offersVisible ? "translate-y-full" : ""}`}>
        <a href="#ofertas" className="flex items-center justify-between rounded-xl bg-gradient-to-b from-lime to-brand px-4 py-3 font-extrabold uppercase text-night">
          <span>Ver ofertas</span><span>a partir de {brl(UNIT.priceCents)}</span>
        </a>
      </div>

      <footer className="border-t border-white/10 bg-night py-8 text-sm text-white/70">
        <Container className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo className="h-12" />
            {STORE.legalName && <p className="mt-3">{STORE.legalName}</p>}
            {STORE.email && <p className="mt-1">Atendimento: {STORE.email}</p>}
            {STORE.whatsapp && (
              <a className="mt-1 inline-block font-semibold text-lime" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noreferrer">Atendimento via WhatsApp</a>
            )}
          </div>
          <nav className="flex flex-col gap-2" aria-label="Informações legais">
            <Link to="/legal/privacidade" className="hover:text-white">Política de privacidade</Link>
            <Link to="/legal/termos" className="hover:text-white">Termos de compra</Link>
            <Link to="/legal/trocas" className="hover:text-white">Troca e devolução</Link>
            <Link to="/legal/suporte" className="hover:text-white">Suporte e atendimento</Link>
          </nav>
        </Container>
        <Container className="mt-6 border-t border-white/10 pt-5 text-xs text-white/45">
          © {new Date().getFullYear()} {STORE.name}. Imagens ilustrativas. Produto recreativo: use proteção ocular e siga a faixa etária da embalagem.
        </Container>
      </footer>
    </>
  );
}
