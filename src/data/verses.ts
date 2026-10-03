import { Testament, VerseSearchResult } from '../types/Verse';

export const TRANSLATION = 'KJV';

export type BibleBook = {
  id: number;
  name: string;
  testament: Testament;
  aliases: string[];
};

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 1, name: 'Genesis', testament: 'Old', aliases: ['gen', 'gn'] },
  { id: 2, name: 'Exodus', testament: 'Old', aliases: ['ex', 'exo'] },
  { id: 3, name: 'Leviticus', testament: 'Old', aliases: ['lev', 'lv'] },
  { id: 4, name: 'Numbers', testament: 'Old', aliases: ['num', 'nm'] },
  { id: 5, name: 'Deuteronomy', testament: 'Old', aliases: ['deut', 'dt'] },
  { id: 6, name: 'Joshua', testament: 'Old', aliases: ['josh', 'jos'] },
  { id: 7, name: 'Judges', testament: 'Old', aliases: ['judg', 'jdg'] },
  { id: 8, name: 'Ruth', testament: 'Old', aliases: ['ru'] },
  { id: 9, name: '1 Samuel', testament: 'Old', aliases: ['1sam', '1 sam'] },
  { id: 10, name: '2 Samuel', testament: 'Old', aliases: ['2sam', '2 sam'] },
  { id: 11, name: '1 Kings', testament: 'Old', aliases: ['1kgs', '1 kings'] },
  { id: 12, name: '2 Kings', testament: 'Old', aliases: ['2kgs', '2 kings'] },
  { id: 13, name: '1 Chronicles', testament: 'Old', aliases: ['1chr', '1 chronicles'] },
  { id: 14, name: '2 Chronicles', testament: 'Old', aliases: ['2chr', '2 chronicles'] },
  { id: 15, name: 'Ezra', testament: 'Old', aliases: ['ezr'] },
  { id: 16, name: 'Nehemiah', testament: 'Old', aliases: ['neh'] },
  { id: 17, name: 'Esther', testament: 'Old', aliases: ['est'] },
  { id: 18, name: 'Job', testament: 'Old', aliases: ['jb'] },
  { id: 19, name: 'Psalms', testament: 'Old', aliases: ['ps', 'psa', 'psalm'] },
  { id: 20, name: 'Proverbs', testament: 'Old', aliases: ['prov', 'prv'] },
  { id: 21, name: 'Ecclesiastes', testament: 'Old', aliases: ['ecc', 'eccl'] },
  { id: 22, name: 'Song of Solomon', testament: 'Old', aliases: ['song', 'sos'] },
  { id: 23, name: 'Isaiah', testament: 'Old', aliases: ['isa', 'is'] },
  { id: 24, name: 'Jeremiah', testament: 'Old', aliases: ['jer'] },
  { id: 25, name: 'Lamentations', testament: 'Old', aliases: ['lam'] },
  { id: 26, name: 'Ezekiel', testament: 'Old', aliases: ['ezek', 'eze'] },
  { id: 27, name: 'Daniel', testament: 'Old', aliases: ['dan', 'dn'] },
  { id: 28, name: 'Hosea', testament: 'Old', aliases: ['hos'] },
  { id: 29, name: 'Joel', testament: 'Old', aliases: ['jl'] },
  { id: 30, name: 'Amos', testament: 'Old', aliases: ['am'] },
  { id: 31, name: 'Obadiah', testament: 'Old', aliases: ['obad', 'ob'] },
  { id: 32, name: 'Jonah', testament: 'Old', aliases: ['jon'] },
  { id: 33, name: 'Micah', testament: 'Old', aliases: ['mic'] },
  { id: 34, name: 'Nahum', testament: 'Old', aliases: ['nah'] },
  { id: 35, name: 'Habakkuk', testament: 'Old', aliases: ['hab'] },
  { id: 36, name: 'Zephaniah', testament: 'Old', aliases: ['zeph'] },
  { id: 37, name: 'Haggai', testament: 'Old', aliases: ['hag'] },
  { id: 38, name: 'Zechariah', testament: 'Old', aliases: ['zech'] },
  { id: 39, name: 'Malachi', testament: 'Old', aliases: ['mal'] },
  { id: 40, name: 'Matthew', testament: 'New', aliases: ['matt', 'mt'] },
  { id: 41, name: 'Mark', testament: 'New', aliases: ['mk', 'mrk'] },
  { id: 42, name: 'Luke', testament: 'New', aliases: ['lk', 'luk'] },
  { id: 43, name: 'John', testament: 'New', aliases: ['jn', 'jhn'] },
  { id: 44, name: 'Acts', testament: 'New', aliases: ['act'] },
  { id: 45, name: 'Romans', testament: 'New', aliases: ['rom', 'ro'] },
  { id: 46, name: '1 Corinthians', testament: 'New', aliases: ['1cor', '1 cor'] },
  { id: 47, name: '2 Corinthians', testament: 'New', aliases: ['2cor', '2 cor'] },
  { id: 48, name: 'Galatians', testament: 'New', aliases: ['gal'] },
  { id: 49, name: 'Ephesians', testament: 'New', aliases: ['eph'] },
  { id: 50, name: 'Philippians', testament: 'New', aliases: ['phil', 'php'] },
  { id: 51, name: 'Colossians', testament: 'New', aliases: ['col'] },
  { id: 52, name: '1 Thessalonians', testament: 'New', aliases: ['1thess', '1 thess'] },
  { id: 53, name: '2 Thessalonians', testament: 'New', aliases: ['2thess', '2 thess'] },
  { id: 54, name: '1 Timothy', testament: 'New', aliases: ['1tim', '1 tim'] },
  { id: 55, name: '2 Timothy', testament: 'New', aliases: ['2tim', '2 tim'] },
  { id: 56, name: 'Titus', testament: 'New', aliases: ['tit'] },
  { id: 57, name: 'Philemon', testament: 'New', aliases: ['phlm'] },
  { id: 58, name: 'Hebrews', testament: 'New', aliases: ['heb'] },
  { id: 59, name: 'James', testament: 'New', aliases: ['jas', 'jam'] },
  { id: 60, name: '1 Peter', testament: 'New', aliases: ['1pet', '1 pet'] },
  { id: 61, name: '2 Peter', testament: 'New', aliases: ['2pet', '2 pet'] },
  { id: 62, name: '1 John', testament: 'New', aliases: ['1jn', '1 john'] },
  { id: 63, name: '2 John', testament: 'New', aliases: ['2jn', '2 john'] },
  { id: 64, name: '3 John', testament: 'New', aliases: ['3jn', '3 john'] },
  { id: 65, name: 'Jude', testament: 'New', aliases: ['jud'] },
  { id: 66, name: 'Revelation', testament: 'New', aliases: ['rev', 're'] },
];

export const TOPICS = [
  'Love',
  'Faith',
  'Hope',
  'Peace',
  'Strength',
  'Wisdom',
  'Comfort',
  'Forgiveness',
  'Prayer',
  'Courage',
  'Grace',
  'Joy',
];

export const POPULAR_BOOKS = [
  'Genesis',
  'Psalms',
  'Proverbs',
  'Isaiah',
  'Matthew',
  'John',
  'Romans',
  'Philippians',
  'Hebrews',
  'Revelation',
];

type RawVerse = {
  book: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
  text: string;
  topics: string[];
};

export const encodeVerseId = (bookId: number, chapter: number, verse: number) =>
  bookId * 1_000_000 + chapter * 1_000 + verse;

export const decodeVerseId = (id: number) => ({
  bookId: Math.floor(id / 1_000_000),
  chapter: Math.floor((id % 1_000_000) / 1_000),
  verse: id % 1_000,
});

export const findBook = (value: string): BibleBook | undefined => {
  const needle = value.trim().toLowerCase().replace(/\s+/g, ' ');
  return BIBLE_BOOKS.find(
    (book) =>
      book.name.toLowerCase() === needle ||
      book.aliases.includes(needle) ||
      book.name.toLowerCase().replace(/^the\s+/, '') === needle
  );
};

export const formatReference = (book: string, chapter: number, verse: number, verseEnd?: number) =>
  verseEnd && verseEnd !== verse ? `${book} ${chapter}:${verse}-${verseEnd}` : `${book} ${chapter}:${verse}`;

export const verseSourceUrl = (reference: string) =>
  `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`;

const RAW_VERSES: RawVerse[] = [
  { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', topics: ['Love', 'Faith', 'Grace'] },
  { book: '1 Corinthians', chapter: 13, verse: 13, text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.', topics: ['Love', 'Faith', 'Hope'] },
  { book: '1 John', chapter: 4, verse: 8, text: 'He that loveth not knoweth not God; for God is love.', topics: ['Love'] },
  { book: 'John', chapter: 15, verse: 13, text: 'Greater love hath no man than this, that a man lay down his life for his friends.', topics: ['Love'] },
  { book: 'Romans', chapter: 8, verse: 38, verseEnd: 39, text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.', topics: ['Love', 'Hope', 'Faith'] },
  { book: '1 John', chapter: 4, verse: 19, text: 'We love him, because he first loved us.', topics: ['Love'] },
  { book: 'Romans', chapter: 5, verse: 8, text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.', topics: ['Love', 'Grace'] },
  { book: 'Hebrews', chapter: 11, verse: 1, text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', topics: ['Faith', 'Hope'] },
  { book: '2 Corinthians', chapter: 5, verse: 7, text: 'For we walk by faith, not by sight.', topics: ['Faith'] },
  { book: 'Romans', chapter: 10, verse: 17, text: 'So then faith cometh by hearing, and hearing by the word of God.', topics: ['Faith'] },
  { book: 'Ephesians', chapter: 2, verse: 8, verseEnd: 9, text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.', topics: ['Faith', 'Grace'] },
  { book: 'Mark', chapter: 11, verse: 22, verseEnd: 23, text: 'And Jesus answering saith unto them, Have faith in God. For verily I say unto you, That whosoever shall say unto this mountain, Be thou removed, and be thou cast into the sea; and shall not doubt in his heart, but shall believe that those things which he saith shall come to pass; he shall have whatsoever he saith.', topics: ['Faith', 'Prayer'] },
  { book: 'Matthew', chapter: 17, verse: 20, text: 'And Jesus said unto them, Because of your unbelief: for verily I say unto you, If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove; and nothing shall be impossible unto you.', topics: ['Faith'] },
  { book: 'Jeremiah', chapter: 29, verse: 11, text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', topics: ['Hope', 'Peace'] },
  { book: 'Romans', chapter: 15, verse: 13, text: 'Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.', topics: ['Hope', 'Joy', 'Peace'] },
  { book: 'Lamentations', chapter: 3, verse: 22, verseEnd: 23, text: 'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.', topics: ['Hope', 'Grace', 'Comfort'] },
  { book: 'Psalm', chapter: 42, verse: 11, text: 'Why art thou cast down, O my soul? and why art thou disquieted within me? hope thou in God: for I shall yet praise him, who is the health of my countenance, and my God.', topics: ['Hope', 'Comfort'] },
  { book: 'Romans', chapter: 8, verse: 24, verseEnd: 25, text: 'For we are saved by hope: but hope that is seen is not hope: for what a man seeth, why doth he yet hope for? But if we hope for that we see not, then do we with patience wait for it.', topics: ['Hope', 'Faith'] },
  { book: 'Isaiah', chapter: 40, verse: 31, text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', topics: ['Hope', 'Strength'] },
  { book: 'John', chapter: 14, verse: 27, text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.', topics: ['Peace', 'Comfort'] },
  { book: 'Philippians', chapter: 4, verse: 6, verseEnd: 7, text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', topics: ['Peace', 'Prayer'] },
  { book: 'Isaiah', chapter: 26, verse: 3, text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.', topics: ['Peace', 'Faith'] },
  { book: 'Numbers', chapter: 6, verse: 24, verseEnd: 26, text: 'The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.', topics: ['Peace', 'Grace'] },
  { book: 'Matthew', chapter: 5, verse: 9, text: 'Blessed are the peacemakers: for they shall be called the children of God.', topics: ['Peace'] },
  { book: 'Colossians', chapter: 3, verse: 15, text: 'And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.', topics: ['Peace', 'Joy'] },
  { book: 'Isaiah', chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', topics: ['Strength', 'Courage', 'Comfort'] },
  { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.', topics: ['Strength', 'Faith'] },
  { book: 'Joshua', chapter: 1, verse: 9, text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', topics: ['Strength', 'Courage'] },
  { book: '2 Timothy', chapter: 1, verse: 7, text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.', topics: ['Courage', 'Love', 'Strength'] },
  { book: 'Psalm', chapter: 46, verse: 1, text: 'God is our refuge and strength, a very present help in trouble.', topics: ['Strength', 'Comfort'] },
  { book: 'Deuteronomy', chapter: 31, verse: 6, text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.', topics: ['Courage', 'Strength'] },
  { book: 'Psalm', chapter: 27, verse: 1, text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?', topics: ['Courage', 'Strength'] },
  { book: 'Proverbs', chapter: 3, verse: 5, verseEnd: 6, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', topics: ['Wisdom', 'Faith'] },
  { book: 'James', chapter: 1, verse: 5, text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.', topics: ['Wisdom', 'Prayer'] },
  { book: 'Proverbs', chapter: 9, verse: 10, text: 'The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.', topics: ['Wisdom'] },
  { book: 'Psalm', chapter: 111, verse: 10, text: 'The fear of the LORD is the beginning of wisdom: a good understanding have all they that do his commandments: his praise endureth for ever.', topics: ['Wisdom'] },
  { book: 'Colossians', chapter: 3, verse: 16, text: 'Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another in psalms and hymns and spiritual songs, singing with grace in your hearts to the Lord.', topics: ['Wisdom', 'Joy'] },
  { book: 'Proverbs', chapter: 4, verse: 7, text: 'Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.', topics: ['Wisdom'] },
  { book: 'Psalm', chapter: 23, verse: 1, verseEnd: 4, text: 'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.', topics: ['Comfort', 'Peace', 'Faith'] },
  { book: 'Matthew', chapter: 11, verse: 28, text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', topics: ['Comfort', 'Peace'] },
  { book: '2 Corinthians', chapter: 1, verse: 3, verseEnd: 4, text: 'Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort; Who comforteth us in all our tribulation, that we may be able to comfort them which are in any trouble, by the comfort wherewith we ourselves are comforted of God.', topics: ['Comfort'] },
  { book: 'Psalm', chapter: 34, verse: 18, text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.', topics: ['Comfort', 'Hope'] },
  { book: 'Revelation', chapter: 21, verse: 4, text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.', topics: ['Comfort', 'Hope'] },
  { book: 'Psalm', chapter: 147, verse: 3, text: 'He healeth the broken in heart, and bindeth up their wounds.', topics: ['Comfort'] },
  { book: '1 John', chapter: 1, verse: 9, text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.', topics: ['Forgiveness', 'Grace'] },
  { book: 'Ephesians', chapter: 4, verse: 32, text: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\'s sake hath forgiven you.', topics: ['Forgiveness', 'Love'] },
  { book: 'Matthew', chapter: 6, verse: 14, text: 'For if ye forgive men their trespasses, your heavenly Father will also forgive you.', topics: ['Forgiveness'] },
  { book: 'Colossians', chapter: 3, verse: 13, text: 'Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye.', topics: ['Forgiveness'] },
  { book: 'Psalm', chapter: 103, verse: 12, text: 'As far as the east is from the west, so far hath he removed our transgressions from us.', topics: ['Forgiveness', 'Grace'] },
  { book: 'Matthew', chapter: 7, verse: 7, text: 'Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.', topics: ['Prayer', 'Faith'] },
  { book: '1 Thessalonians', chapter: 5, verse: 16, verseEnd: 18, text: 'Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.', topics: ['Prayer', 'Joy'] },
  { book: 'James', chapter: 5, verse: 16, text: 'Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.', topics: ['Prayer'] },
  { book: 'Jeremiah', chapter: 33, verse: 3, text: 'Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.', topics: ['Prayer'] },
  { book: 'Matthew', chapter: 6, verse: 6, text: 'But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret; and thy Father which seeth in secret shall reward thee openly.', topics: ['Prayer'] },
  { book: 'Romans', chapter: 8, verse: 31, text: 'What shall we then say to these things? If God be for us, who can be against us?', topics: ['Courage', 'Faith'] },
  { book: 'Isaiah', chapter: 43, verse: 1, verseEnd: 2, text: 'But now thus saith the LORD that created thee, O Jacob, and he that formed thee, O Israel, Fear not: for I have redeemed thee, I have called thee by thy name; thou art mine. When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee.', topics: ['Courage', 'Comfort'] },
  { book: 'Psalm', chapter: 56, verse: 3, text: 'What time I am afraid, I will trust in thee.', topics: ['Courage', 'Faith'] },
  { book: '2 Corinthians', chapter: 12, verse: 9, text: 'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.', topics: ['Grace', 'Strength'] },
  { book: 'Titus', chapter: 2, verse: 11, text: 'For the grace of God that bringeth salvation hath appeared to all men.', topics: ['Grace'] },
  { book: 'Hebrews', chapter: 4, verse: 16, text: 'Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.', topics: ['Grace', 'Prayer'] },
  { book: 'John', chapter: 1, verse: 16, text: 'And of his fulness have all we received, and grace for grace.', topics: ['Grace'] },
  { book: 'Nehemiah', chapter: 8, verse: 10, text: 'Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.', topics: ['Joy', 'Strength'] },
  { book: 'Psalm', chapter: 16, verse: 11, text: 'Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.', topics: ['Joy'] },
  { book: 'John', chapter: 15, verse: 11, text: 'These things have I spoken unto you, that my joy might remain in you, and that your joy might be full.', topics: ['Joy'] },
  { book: 'Psalm', chapter: 118, verse: 24, text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.', topics: ['Joy'] },
  { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.', topics: ['Wisdom', 'Faith'] },
  { book: 'Micah', chapter: 6, verse: 8, text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?', topics: ['Wisdom', 'Love'] },
  { book: 'Matthew', chapter: 6, verse: 33, text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', topics: ['Faith', 'Wisdom'] },
  { book: 'Matthew', chapter: 22, verse: 37, verseEnd: 39, text: 'Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself.', topics: ['Love'] },
  { book: 'John', chapter: 14, verse: 6, text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.', topics: ['Faith'] },
  { book: 'Romans', chapter: 12, verse: 2, text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.', topics: ['Wisdom', 'Faith'] },
  { book: 'Galatians', chapter: 5, verse: 22, verseEnd: 23, text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law.', topics: ['Love', 'Joy', 'Peace'] },
  { book: 'Philippians', chapter: 4, verse: 8, text: 'Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.', topics: ['Wisdom', 'Peace'] },
  { book: 'Hebrews', chapter: 13, verse: 8, text: 'Jesus Christ the same yesterday, and to day, and for ever.', topics: ['Faith', 'Hope'] },
  { book: 'James', chapter: 1, verse: 17, text: 'Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.', topics: ['Grace', 'Joy'] },
  { book: '1 Peter', chapter: 5, verse: 7, text: 'Casting all your care upon him; for he careth for you.', topics: ['Comfort', 'Prayer'] },
  { book: 'Revelation', chapter: 3, verse: 20, text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.', topics: ['Faith', 'Hope'] },
  { book: 'Psalm', chapter: 119, verse: 105, text: 'Thy word is a lamp unto my feet, and a light unto my path.', topics: ['Wisdom', 'Faith'] },
  { book: 'Isaiah', chapter: 40, verse: 8, text: 'The grass withereth, the flower fadeth: but the word of our God shall stand for ever.', topics: ['Hope', 'Faith'] },
  { book: 'Nahum', chapter: 1, verse: 7, text: 'The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.', topics: ['Comfort', 'Faith'] },
  { book: 'Isaiah', chapter: 12, verse: 2, text: 'Behold, God is my salvation; I will trust, and not be afraid: for the LORD JEHOVAH is my strength and my song; he also is become my salvation.', topics: ['Faith', 'Strength', 'Joy'] },
];

const toSearchResult = (raw: RawVerse): VerseSearchResult | null => {
  const bookName = raw.book === 'Psalm' ? 'Psalms' : raw.book;
  const book = findBook(bookName);
  if (!book) return null;
  const reference = formatReference(book.name, raw.chapter, raw.verse, raw.verseEnd);
  return {
    id: encodeVerseId(book.id, raw.chapter, raw.verse),
    reference,
    book: book.name,
    chapter: raw.chapter,
    verse: raw.verse,
    verseEnd: raw.verseEnd,
    text: raw.text,
    topics: raw.topics,
    testament: book.testament,
    translation: TRANSLATION,
    sourceUrl: verseSourceUrl(reference),
  };
};

export const VERSE_CATALOG: VerseSearchResult[] = RAW_VERSES.map(toSearchResult).filter(
  (verse): verse is VerseSearchResult => verse !== null
);

export const getCatalogVerse = (id: number) => VERSE_CATALOG.find((verse) => verse.id === id);

export const getDailyCatalogVerse = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return VERSE_CATALOG[day % VERSE_CATALOG.length];
};

export const shuffleVerses = (verses: VerseSearchResult[]) => {
  const next = [...verses];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const parseReference = (value: string) => {
  const match = value
    .trim()
    .match(/^((?:\d+\s+)?[A-Za-z]+(?:\s+of\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?$/i);
  if (!match) return null;
  const book = findBook(match[1]);
  if (!book) return null;
  return {
    book,
    chapter: parseInt(match[2], 10),
    verse: parseInt(match[3], 10),
    verseEnd: match[4] ? parseInt(match[4], 10) : undefined,
  };
};
