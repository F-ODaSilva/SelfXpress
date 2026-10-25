/* SelfXpress — catálogo. Preços em meticais (MT), IVA incluído. */
window.SX = window.SX || {};

SX.whatsapp = "258844414441";          // número que recebe as encomendas
SX.phoneLabel = "+258 84 441 4441";
SX.freeFrom = 5000;                     // entrega grátis a partir de 5.000 MT

SX.categories = [
  { id: "tech", name: "Tecnologia", line: "Telemóveis, portáteis, áudio e foto.", img: "assets/img/product-showcase-1-sm.webp" },
  { id: "gaming", name: "Gaming", line: "Consolas, comandos e setups completos.", img: "assets/img/desksetup-sm.webp" },
  { id: "casa", name: "Casa", line: "Electrodomésticos que poupam tempo.", img: "assets/img/illus/robot-vacuum.svg", illus: true },
  { id: "kids", name: "Kids", line: "Gadgets seguros e divertidos para crianças.", img: "assets/img/father-sm.webp" }
];

const P = (id, name, cat, price, img, extra = {}) => ({ id, name, cat, price, img: img.includes("/") ? img : `assets/img/products/${img}.webp`, tags: [], stock: 8, specs: [], ...extra });

SX.products = [
  // Tecnologia
  P("iphone-12-pro", "iPhone 12 Pro 128 GB", "tech", 38900, "iphone-12-pro", { was: 44500, tags: ["promo", "destaque"], stock: 3, cond: "Recondicionado A+", desc: "Grafite, bateria acima de 88%, testado em 40 pontos e com 12 meses de garantia SelfXpress.", specs: [["Ecrã", "6,1\" Super Retina XDR"], ["Câmaras", "Tripla 12 MP + LiDAR"], ["Armazenamento", "128 GB"], ["Garantia", "12 meses"]] }),
  P("iphone-8", "iPhone 8 64 GB", "tech", 12900, "iphone-black", { stock: 6, cond: "Recondicionado A", desc: "Preto mate, ideal como primeiro iPhone ou telemóvel de trabalho. Inclui cabo e película.", specs: [["Ecrã", "4,7\" Retina HD"], ["Armazenamento", "64 GB"], ["Bateria", "Acima de 85%"], ["Garantia", "6 meses"]] }),
  P("ipad-pro-11", "iPad Pro 11\" 128 GB Wi-Fi", "tech", 62500, "ipad-pro", { tags: ["destaque"], stock: 2, desc: "Chip M2, ecrã ProMotion de 120 Hz e compatível com Apple Pencil (vendido em separado).", specs: [["Chip", "Apple M2"], ["Ecrã", "11\" Liquid Retina 120 Hz"], ["Armazenamento", "128 GB"], ["Ligação", "Wi-Fi 6E"]] }),
  P("macbook-pro-14", "MacBook Pro 14\" M3 512 GB", "tech", 129000, "macbook-pro", { stock: 2, desc: "Cinzento sideral, 8 GB de memória unificada e até 22 horas de bateria. Teclado PT.", specs: [["Chip", "Apple M3"], ["Memória", "8 GB"], ["SSD", "512 GB"], ["Bateria", "Até 22 h"]] }),
  P("magic-mouse", "Magic Mouse", "tech", 6500, "magic-mouse", { desc: "Superfície Multi-Touch, recarregável por USB-C. Liga-se a qualquer Mac por Bluetooth.", specs: [["Ligação", "Bluetooth"], ["Carga", "USB-C"], ["Autonomia", "Cerca de 1 mês"]] }),
  P("magsafe-15w", "Carregador MagSafe 15 W", "tech", 2900, "magsafe-pad", { was: 3400, tags: ["promo"], stock: 24, desc: "Encaixa magneticamente no iPhone 12 ou mais recente e carrega até 15 W.", specs: [["Potência", "Até 15 W"], ["Cabo", "1 m USB-C"], ["Compatível", "iPhone 12 a 16"]] }),
  P("magsafe-kit", "Kit MagSafe + adaptador 20 W", "tech", 3900, "magsafe-box", { stock: 15, desc: "Carregador MagSafe selado com adaptador de parede de 20 W, pronto para tomadas moçambicanas.", specs: [["Inclui", "Carregador + adaptador 20 W"], ["Ficha", "Tipo C/M com adaptador"]] }),
  P("capa-magsafe", "Capa transparente MagSafe", "tech", 1450, "magsafe-case", { stock: 30, desc: "Policarbonato anti-amarelecimento com íman MagSafe. Para iPhone 13, 14 e 15.", specs: [["Material", "Policarbonato + TPU"], ["Compatível", "iPhone 13 a 15"]] }),
  P("relogio-cronografo", "Relógio cronógrafo em pele", "tech", 7900, "chrono-watch", { stock: 5, desc: "Caixa de 42 mm em aço preto, bracelete de pele e resistência à água 5 ATM.", specs: [["Caixa", "42 mm aço"], ["Bracelete", "Pele genuína"], ["Água", "5 ATM"]] }),
  P("camara-compacta", "Câmara compacta + estojo em pele", "tech", 54000, "compact-camera", { stock: 1, desc: "Sensor de 1\", objectiva fixa luminosa e estojo de pele castanha com alça.", specs: [["Sensor", "1\" 20 MP"], ["Vídeo", "4K 30p"], ["Inclui", "Estojo e alça de pele"]] }),
  P("objectiva-50mm", "Objectiva 50 mm f/1.8", "tech", 18500, "lens-50mm", { stock: 3, desc: "Encaixe E, autofoco silencioso. A objectiva certa para retratos e baixa luz.", specs: [["Encaixe", "Sony E"], ["Abertura", "f/1.8"], ["Peso", "186 g"]] }),
  // Gaming
  P("xbox-series-x", "Xbox Series X 1 TB", "gaming", 42000, "xbox-series-x", { was: 46000, tags: ["promo", "destaque", "deal"], stock: 4, desc: "4K a 120 fps, SSD de 1 TB e comando sem fios incluído. Versão europeia com garantia local.", specs: [["Resolução", "Até 4K 120 fps"], ["Armazenamento", "1 TB SSD"], ["Inclui", "1 comando sem fios"], ["Garantia", "12 meses"]] }),
  P("dualsense", "Comando DualSense PS5", "gaming", 5900, "dualsense", { tags: ["destaque"], stock: 12, desc: "Feedback háptico e gatilhos adaptáveis. Branco, original Sony.", specs: [["Ligação", "Bluetooth / USB-C"], ["Bateria", "Até 12 h"]] }),
  P("oculos-vr", "Óculos VR com comandos", "gaming", 39900, "vr-headset", { tags: ["destaque"], stock: 3, desc: "Realidade virtual sem fios, com 2 comandos de movimento e 128 GB para jogos.", specs: [["Armazenamento", "128 GB"], ["Comandos", "2 incluídos"], ["Autonomia", "2 a 3 h"]] }),
  P("torre-gamer", "Torre gamer RGB", "gaming", 98000, "gaming-tower", { stock: 2, desc: "Ryzen 7, RTX 4070, 32 GB RAM e 1 TB NVMe. Montada e testada em Maputo.", specs: [["CPU", "AMD Ryzen 7 7700"], ["GPU", "RTX 4070 12 GB"], ["RAM", "32 GB DDR5"], ["SSD", "1 TB NVMe"]] }),
  P("monitor-27", "Monitor curvo 27\" 165 Hz", "gaming", 21500, "monitor-27", { stock: 5, desc: "Painel VA curvo 1500R, QHD a 165 Hz e 1 ms. HDMI 2.0 e DisplayPort.", specs: [["Resolução", "2560 × 1440"], ["Frequência", "165 Hz"], ["Resposta", "1 ms"]] }),
  P("teclado-rgb", "Teclado mecânico RGB", "gaming", 4800, "rgb-keyboard", { stock: 9, desc: "Switches vermelhos lineares, iluminação RGB por tecla e layout PT.", specs: [["Switches", "Vermelhos lineares"], ["Layout", "PT-PT"], ["Ligação", "USB-C"]] }),
  P("kit-setup-rgb", "Kit setup RGB", "gaming", 34900, "rgb-setup", { was: 38200, tags: ["promo"], stock: 3, desc: "Monitor 27\", teclado mecânico e rato RGB, entregues e instalados na sua secretária.", specs: [["Inclui", "Monitor, teclado, rato"], ["Instalação", "Grátis em Maputo"]] }),
  P("comando-media-xbox", "Comando multimédia Xbox", "gaming", 1900, "xbox-remote", { stock: 14, desc: "Controle filmes e séries na Xbox sem pegar no comando de jogo.", specs: [["Ligação", "Infravermelhos"], ["Pilhas", "2 × AAA incluídas"]] }),
  // Casa
  P("air-fryer", "Air fryer digital 5,5 L", "casa", 6900, "assets/img/illus/air-fryer.svg", { illus: true, tags: ["destaque"], stock: 10, desc: "8 programas, cesto antiaderente e até 80% menos óleo. Cabe um frango inteiro.", specs: [["Capacidade", "5,5 L"], ["Potência", "1700 W"], ["Programas", "8"]] }),
  P("chaleira-inox", "Chaleira eléctrica inox 1,7 L", "casa", 1650, "assets/img/illus/kettle.svg", { illus: true, stock: 18, desc: "Ferve 1 L em cerca de 3 minutos, desliga sozinha e tem visor de nível.", specs: [["Capacidade", "1,7 L"], ["Potência", "2200 W"]] }),
  P("aspirador-robo", "Aspirador robô com mapeamento", "casa", 18900, "assets/img/illus/robot-vacuum.svg", { illus: true, was: 21900, tags: ["promo"], stock: 4, desc: "Aspira e passa pano, mapeia a casa por laser e controla-se pelo telemóvel.", specs: [["Navegação", "Laser LiDAR"], ["Autonomia", "150 min"], ["App", "Android e iOS"]] }),
  P("ventoinha-40", "Ventoinha de mesa 40 cm", "casa", 2400, "assets/img/illus/desk-fan.svg", { illus: true, stock: 20, desc: "3 velocidades, oscilação de 90° e motor silencioso para as noites de Dezembro.", specs: [["Diâmetro", "40 cm"], ["Velocidades", "3"], ["Ruído", "Menos de 45 dB"]] }),
  // Kids
  P("relogio-gps-kids", "Relógio GPS infantil com SOS", "kids", 3900, "assets/img/illus/kids-gps-watch.svg", { illus: true, tags: ["destaque"], stock: 11, desc: "Localização em tempo real, botão SOS e chamadas só para os contactos que aprovar.", specs: [["Localização", "GPS + Wi-Fi"], ["Rede", "4G (cartão SIM)"], ["Água", "IP67"]] }),
  P("tablet-kids", "Tablet infantil 8\" com capa", "kids", 7400, "assets/img/illus/kids-tablet.svg", { illus: true, stock: 7, desc: "Capa anti-choque com pega, controlo parental e apps educativas em português.", specs: [["Ecrã", "8\" HD"], ["Armazenamento", "32 GB"], ["Controlo parental", "Sim"]] })
];

SX.zones = [
  { id: "maputo", name: "Maputo Cidade", fee: 150, eta: "No mesmo dia, se encomendar até às 14h" },
  { id: "matola", name: "Matola", fee: 250, eta: "No dia seguinte" },
  { id: "boane", name: "Boane / Marracuene", fee: 400, eta: "1 a 2 dias úteis" },
  { id: "recolha", name: "Recolha em Malhangalene", fee: 0, eta: "Pronto em 2 horas" }
];

SX.reviews = [
  { name: "Inês M.", where: "Maputo, Sommerschield II", img: "testimonial3", text: "A qualidade do produto superou as minhas expectativas e a entrega foi rápida e sem complicações." },
  { name: "Ricardo T.", where: "Matola, Matola Rio", img: "testimonial5", text: "Recorro sempre à SelfXpress quando preciso de equipar os meus Airbnbs. Respondem no WhatsApp em minutos." },
  { name: "Kevin A.", where: "Maputo, Xinamanquila, Bairro C", img: "testimonial-3", text: "Os meus amigos recomendaram e desde então é a primeira loja onde procuro." }
];
