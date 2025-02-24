-- Inserção de dados iniciais em tipos_planta
INSERT INTO tipos_planta (nome) VALUES
    ('Cactos'),
    ('Suculentas'),
    ('Orquídeas'),
    ('Samambaias'),
    ('Palmeiras'),
    ('Flores'),
    ('Árvores'),
    ('Trepadeiras'),
    ('Ervas'),
    ('Plantas Aquáticas');

-- Inserção de dados de exemplo em plantas
INSERT INTO plantas (
    nome,
    subtitulo,
    etiquetas,
    preco,
    esta_em_promocao,
    porcentagem_desconto,
    caracteristicas,
    descricao,
    url_imagem,
    tipo_planta_id
) VALUES 
(
    'Cacto Mandacaru',
    'O clássico cacto brasileiro',
    '["cacto", "nativo", "decorativo"]',
    49.90,
    false,
    null,
    'Planta resistente, adaptada ao clima seco, crescimento lento, necessita pouca água',
    'O Mandacaru é um cacto nativo do Brasil, muito resistente e decorativo. Pode crescer até vários metros de altura em seu habitat natural. Ideal para jardins decorativos e paisagismo.',
    'https://www.shutterstock.com/image-photo/plant-cereus-jamacaru-mandacaru-cardeiro-260nw-2140382967.jpg',
    1
),
(
    'Orquídea Phalaenopsis',
    'A rainha das orquídeas',
    '["orquídea", "flores", "delicada"]',
    89.90,
    true,
    15.00,
    'Flores duradouras, ideal para ambientes internos, necessita de boa iluminação indireta',
    'A Phalaenopsis é uma das orquídeas mais populares, conhecida por suas flores duradouras e beleza exótica. Suas flores podem durar até 3 meses com os cuidados adequados.',
    'https://www.shutterstock.com/shutterstock/photos/2164555821/display_1500/stock-photo-colorful-orchids-phalaenopsis-blooming-orchids-gardening-hobby-purple-pink-orange-red-orchids-2164555821.jpg',
    3
),
(
    'Samambaia Americana',
    'Elegância e frescor para seu ambiente',
    '["samambaia", "sombra", "tropical"]',
    39.90,
    true,
    20.00,
    'Adapta-se bem a ambientes internos, prefere locais úmidos e sombreados',
    'A Samambaia Americana é uma planta muito versátil e popular, perfeita para decorar ambientes internos. Suas folhas verdes e delicadas trazem um toque de natureza para qualquer espaço.',
    'https://cdn.awsli.com.br/800x800/1348/1348550/produto/311514664/sam-americana-66fe3d8f38d1e-v1vhn7ox01.jpeg',
    4
),
(
    'Suculenta Echeveria',
    'A joia do deserto',
    '["suculenta", "pequena", "decorativa"]',
    29.90,
    false,
    null,
    'Baixa manutenção, ideal para pequenos espaços, variedade de cores',
    'A Echeveria é uma suculenta muito apreciada por sua beleza e facilidade de cuidado. Suas rosetas simétricas e coloração única a tornam perfeita para decoração.',
    'https://www.shutterstock.com/shutterstock/photos/2506208405/display_1500/stock-photo-echeveria-elegans-grows-in-a-small-pot-that-draws-well-2506208405.jpg',
    2
);