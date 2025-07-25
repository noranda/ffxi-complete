/**
 * FFXI Icon System Types
 *
 * Defines TypeScript types for the categorized SVG sprite icon system.
 * Supports 1,282 authentic FFXI icons organized by content category.
 */

/**
 * Props for FFXIIcon component
 */
export type FFXIIconProps = {
  category: IconCategory;
  className?: string;
  name: string;
  onClick?: () => void;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  size?: IconSize;
  title?: string;
};

/**
 * Available icon categories matching sprite files
 * Total of 1,282 icons across all categories
 */
export type IconCategory =
  | 'magic' // Magic spell icons (642 total)
  | 'status'; // Status effect icons (640 total)

/**
 * Icon loading state
 */
export type IconLoadingState = {
  error: null | string;
  loaded: boolean;
  loading: boolean;
};

/**
 * Icon metadata structure
 */
export type IconMetadata = {
  aliases?: string[];
  authentic: boolean;
  category: IconCategory;
  description?: string;
  lastUpdated: string;
  name: string;
  source?: string;
  tags?: string[];
};

/**
 * Union type for all possible icon names
 */
export type IconName = MagicIconName | StatusIconName;

/**
 * Icon registry structure
 */
export type IconRegistry = {
  categories: {
    [K in IconCategory]: {
      count: number;
      description: string;
      icons: IconMetadata[];
      spriteFile: string;
    };
  };
  version: string;
};

/**
 * Valid icon sizes
 */
export type IconSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl';

/**
 * Magic spell icon names (642 total)
 * These are numeric string identifiers (0-639, plus some variants)
 */
export type MagicIconName =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '22Alt'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | '32'
  | '33'
  | '34'
  | '35'
  | '36'
  | '37'
  | '38'
  | '39'
  | '40'
  | '41'
  | '42'
  | '43'
  | '44'
  | '45'
  | '46'
  | '47'
  | '48'
  | '49'
  | '50'
  | '51'
  | '52'
  | '53'
  | '54'
  | '55'
  | '56'
  | '57'
  | '58'
  | '59'
  | '60'
  | '61'
  | '62'
  | '63'
  | '64'
  | '65'
  | '66'
  | '67'
  | '68'
  | '69'
  | '70'
  | '71'
  | '72'
  | '73'
  | '74'
  | '75'
  | '76'
  | '77'
  | '78'
  | '79'
  | '80'
  | '81'
  | '82'
  | '83'
  | '84'
  | '85'
  | '86'
  | '87'
  | '88'
  | '89'
  | '90'
  | '91'
  | '92'
  | '93'
  | '94'
  | '95'
  | '96'
  | '97'
  | '98'
  | '99'
  | '100'
  | '101'
  | '102'
  | '103'
  | '104'
  | '105'
  | '106'
  | '107'
  | '108'
  | '109'
  | '110'
  | '111'
  | '112'
  | '113'
  | '114'
  | '115'
  | '116'
  | '117'
  | '118'
  | '119'
  | '120'
  | '121'
  | '122'
  | '123'
  | '124'
  | '125'
  | '126'
  | '127'
  | '128'
  | '129'
  | '130'
  | '131'
  | '132'
  | '133'
  | '134'
  | '135'
  | '136'
  | '137'
  | '138'
  | '139'
  | '140'
  | '141'
  | '142'
  | '143'
  | '144'
  | '145'
  | '146'
  | '147'
  | '148'
  | '149'
  | '150'
  | '151'
  | '152'
  | '153'
  | '154'
  | '155'
  | '156'
  | '157'
  | '158'
  | '159'
  | '160'
  | '161'
  | '162'
  | '163'
  | '164'
  | '165'
  | '166'
  | '167'
  | '168'
  | '169'
  | '170'
  | '171'
  | '172'
  | '173'
  | '174'
  | '175'
  | '176'
  | '177'
  | '178'
  | '179'
  | '180'
  | '181'
  | '182'
  | '183'
  | '184'
  | '185'
  | '186'
  | '187'
  | '188'
  | '189'
  | '190'
  | '191'
  | '192'
  | '193'
  | '194'
  | '195'
  | '196'
  | '197'
  | '198'
  | '199'
  | '200'
  | '201'
  | '202'
  | '203'
  | '204'
  | '205'
  | '206'
  | '207'
  | '208'
  | '209'
  | '210'
  | '211'
  | '212'
  | '213'
  | '214'
  | '215'
  | '216'
  | '217'
  | '218'
  | '219'
  | '220'
  | '221'
  | '222'
  | '223'
  | '224'
  | '225'
  | '226'
  | '227'
  | '228'
  | '229'
  | '230'
  | '231'
  | '232'
  | '233'
  | '234'
  | '235'
  | '235-Alt'
  | '236'
  | '237'
  | '237-Alt'
  | '238'
  | '239'
  | '240'
  | '241'
  | '242'
  | '243'
  | '245'
  | '246'
  | '247'
  | '248'
  | '249'
  | '250'
  | '251'
  | '252'
  | '253'
  | '254'
  | '255'
  | '256'
  | '257'
  | '258'
  | '259'
  | '260'
  | '261'
  | '262'
  | '263'
  | '264'
  | '265'
  | '266'
  | '267'
  | '268'
  | '269'
  | '270'
  | '271'
  | '272'
  | '273'
  | '274'
  | '275'
  | '276'
  | '277'
  | '278'
  | '279'
  | '280'
  | '281'
  | '282'
  | '283'
  | '284'
  | '285'
  | '286'
  | '287'
  | '288'
  | '289'
  | '290'
  | '291'
  | '292'
  | '293'
  | '294'
  | '295'
  | '296'
  | '297'
  | '298'
  | '299'
  | '300'
  | '301'
  | '302'
  | '303'
  | '304'
  | '305'
  | '306'
  | '307'
  | '308'
  | '309'
  | '310'
  | '311'
  | '312'
  | '313'
  | '314'
  | '315'
  | '316'
  | '317'
  | '318'
  | '319'
  | '320'
  | '321'
  | '322'
  | '323'
  | '324'
  | '325'
  | '326'
  | '327'
  | '328'
  | '329'
  | '330'
  | '331'
  | '332'
  | '333'
  | '334'
  | '335'
  | '336'
  | '337'
  | '338'
  | '339'
  | '340'
  | '341'
  | '342'
  | '343'
  | '344'
  | '345'
  | '346'
  | '347'
  | '348'
  | '349'
  | '350'
  | '351'
  | '352'
  | '353'
  | '354'
  | '355'
  | '356'
  | '357'
  | '358'
  | '359'
  | '360'
  | '361'
  | '362'
  | '363'
  | '364'
  | '365'
  | '366'
  | '367'
  | '368'
  | '369'
  | '370'
  | '371'
  | '372'
  | '373'
  | '374'
  | '375'
  | '376'
  | '377'
  | '378'
  | '379'
  | '380'
  | '381'
  | '382'
  | '383'
  | '384'
  | '385'
  | '386'
  | '387'
  | '388'
  | '389'
  | '390'
  | '391'
  | '392'
  | '393'
  | '394'
  | '395'
  | '396'
  | '397'
  | '398'
  | '399'
  | '400'
  | '401'
  | '402'
  | '403'
  | '404'
  | '405'
  | '406'
  | '407'
  | '408'
  | '409'
  | '410'
  | '411'
  | '412'
  | '413'
  | '414'
  | '415'
  | '416'
  | '417'
  | '418'
  | '419'
  | '420'
  | '421'
  | '422'
  | '423'
  | '424'
  | '425'
  | '426'
  | '427'
  | '428'
  | '429'
  | '430'
  | '431'
  | '432'
  | '433'
  | '434'
  | '435'
  | '436'
  | '437'
  | '438'
  | '439'
  | '440'
  | '441'
  | '442'
  | '443'
  | '444'
  | '445'
  | '446'
  | '447'
  | '448'
  | '449'
  | '450'
  | '451'
  | '452'
  | '453'
  | '454'
  | '455'
  | '456'
  | '457'
  | '458'
  | '459'
  | '460'
  | '461'
  | '462'
  | '463'
  | '464'
  | '465'
  | '466'
  | '467'
  | '468'
  | '469'
  | '470'
  | '471'
  | '472'
  | '473'
  | '474'
  | '475'
  | '476'
  | '477'
  | '478'
  | '479'
  | '480'
  | '481'
  | '482'
  | '483'
  | '484'
  | '485'
  | '486'
  | '487'
  | '488'
  | '489'
  | '490'
  | '491'
  | '492'
  | '493'
  | '494'
  | '495'
  | '496'
  | '497'
  | '498'
  | '499'
  | '500'
  | '501'
  | '502'
  | '503'
  | '504'
  | '505'
  | '506'
  | '507'
  | '508'
  | '509'
  | '510'
  | '511'
  | '512'
  | '513'
  | '514'
  | '515'
  | '516'
  | '517'
  | '518'
  | '519'
  | '520'
  | '521'
  | '522'
  | '523'
  | '524'
  | '525'
  | '526'
  | '527'
  | '528'
  | '529'
  | '530'
  | '531'
  | '532'
  | '533'
  | '534'
  | '535'
  | '536'
  | '537'
  | '538'
  | '539'
  | '540'
  | '541'
  | '542'
  | '543'
  | '544'
  | '545'
  | '546'
  | '547'
  | '548'
  | '549'
  | '550'
  | '551'
  | '552'
  | '553'
  | '554'
  | '555'
  | '556'
  | '557'
  | '558'
  | '559'
  | '560'
  | '561'
  | '562'
  | '563'
  | '564'
  | '565'
  | '566'
  | '567'
  | '568'
  | '569'
  | '570'
  | '571'
  | '572'
  | '573'
  | '574'
  | '575'
  | '576'
  | '577'
  | '578'
  | '579'
  | '580'
  | '581'
  | '582'
  | '583'
  | '584'
  | '585'
  | '586'
  | '587'
  | '588'
  | '589'
  | '590'
  | '591'
  | '592'
  | '593'
  | '594'
  | '595'
  | '596'
  | '597'
  | '598'
  | '599'
  | '600'
  | '601'
  | '602'
  | '603'
  | '604'
  | '605'
  | '606'
  | '607'
  | '608'
  | '609'
  | '610'
  | '611'
  | '612'
  | '613'
  | '614'
  | '615'
  | '616'
  | '617'
  | '618'
  | '619'
  | '620'
  | '621'
  | '622'
  | '623'
  | '624'
  | '625'
  | '626'
  | '627'
  | '628'
  | '629'
  | '630'
  | '631'
  | '632'
  | '633'
  | '634'
  | '635'
  | '636'
  | '637'
  | '638'
  | '639';

/**
 * Status effect icon names (640 total)
 * These are descriptive names for various status effects, buffs, and debuffs
 */
export type StatusIconName =
  | 'accuracy-boost'
  | 'accuracy-down'
  | 'addle'
  | 'aggressor'
  | 'agi-boost'
  | 'agi-down'
  | 'amnesia'
  | 'ancient-circle'
  | 'aquaveil'
  | 'arcane-circle'
  | 'attack-boost'
  | 'attack-down'
  | 'bane'
  | 'berserk'
  | 'bind'
  | 'blaze-spikes'
  | 'blindness'
  | 'blink'
  | 'boost'
  | 'chainspell'
  | 'charm-i'
  | 'charm-ii'
  | 'chr-boost'
  | 'chr-down'
  | 'curse-i'
  | 'curse-ii'
  | 'damage-spikes'
  | 'defender'
  | 'defense-down'
  | 'deodorize'
  | 'dex-boost'
  | 'dex-down'
  | 'disease'
  | 'dodge'
  | 'doom'
  | 'enmity-boost'
  | 'enmity-down'
  | 'evasion-boost'
  | 'evasion-down'
  | 'flee'
  | 'focus'
  | 'food'
  | 'gradual-petrification'
  | 'haste'
  | 'hide'
  | 'holy-circle'
  | 'hundred-fists'
  | 'ice-spikes'
  | 'inhibit-tp'
  | 'int-boost'
  | 'int-down'
  | 'intimidate'
  | 'invincible'
  | 'invisible'
  | 'kaustra'
  | 'ko'
  | 'magic-attack-boost'
  | 'magic-attack-down'
  | 'magic-defense-boost'
  | 'magic-defense-down'
  | 'manafont'
  | 'max-hp-boost'
  | 'max-hp-down'
  | 'max-mp-boost'
  | 'max-mp-down'
  | 'medicine'
  | 'mighty-strikes'
  | 'mnd-boost'
  | 'mnd-down'
  | 'mute'
  | 'paralysis'
  | 'perfect-dodge'
  | 'petrification'
  | 'plague'
  | 'poison'
  | 'protect'
  | 'provoke'
  | 'refresh'
  | 'regen'
  | 'reraise'
  | 'shell'
  | 'shock-spikes'
  | 'silence'
  | 'sleep-i'
  | 'sleep-ii'
  | 'slow'
  | 'sneak'
  | 'sneak-attack'
  | 'stoneskin'
  | 'str-boost'
  | 'str-down'
  | 'stun'
  | 'terror'
  | 'trick-attack'
  | 'two-hour-ability'
  | 'unknown-24'
  | 'unknown-25'
  | 'unknown-26'
  | 'unknown-27'
  | 'unknown-105'
  | 'unknown-106'
  | 'unknown-107'
  | 'unknown-108'
  | 'unknown-109'
  | 'unknown-110'
  | 'unknown-111'
  | 'unknown-112'
  | 'unknown-113'
  | 'unknown-114'
  | 'unknown-115'
  | 'unknown-116'
  | 'unknown-117'
  | 'unknown-118'
  | 'unknown-119'
  | 'unknown-120'
  | 'unknown-121'
  | 'unknown-122'
  | 'unknown-123'
  | 'unknown-124'
  | 'unknown-125'
  | 'unknown-126'
  | 'unknown-127'
  | 'unknown-128'
  | 'unknown-129'
  | 'unknown-130'
  | 'unknown-131'
  | 'unknown-132'
  | 'unknown-133'
  | 'unknown-134'
  | 'unknown-135'
  | 'unknown-136'
  | 'unknown-137'
  | 'unknown-138'
  | 'unknown-139'
  | 'unknown-140'
  | 'unknown-141'
  | 'unknown-142'
  | 'unknown-143'
  | 'unknown-144'
  | 'unknown-145'
  | 'unknown-146'
  | 'unknown-147'
  | 'unknown-148'
  | 'unknown-149'
  | 'unknown-150'
  | 'unknown-151'
  | 'unknown-152'
  | 'unknown-153'
  | 'unknown-154'
  | 'unknown-155'
  | 'unknown-156'
  | 'unknown-157'
  | 'unknown-158'
  | 'unknown-159'
  | 'unknown-160'
  | 'unknown-161'
  | 'unknown-162'
  | 'unknown-163'
  | 'unknown-164'
  | 'unknown-165'
  | 'unknown-166'
  | 'unknown-167'
  | 'unknown-168'
  | 'unknown-169'
  | 'unknown-170'
  | 'unknown-171'
  | 'unknown-172'
  | 'unknown-173'
  | 'unknown-174'
  | 'unknown-175'
  | 'unknown-176'
  | 'unknown-177'
  | 'unknown-178'
  | 'unknown-179'
  | 'unknown-180'
  | 'unknown-181'
  | 'unknown-182'
  | 'unknown-183'
  | 'unknown-184'
  | 'unknown-185'
  | 'unknown-186'
  | 'unknown-187'
  | 'unknown-188'
  | 'unknown-189'
  | 'unknown-190'
  | 'unknown-191'
  | 'unknown-192'
  | 'unknown-193'
  | 'unknown-194'
  | 'unknown-195'
  | 'unknown-196'
  | 'unknown-197'
  | 'unknown-198'
  | 'unknown-199'
  | 'unknown-200'
  | 'unknown-201'
  | 'unknown-202'
  | 'unknown-203'
  | 'unknown-204'
  | 'unknown-205'
  | 'unknown-206'
  | 'unknown-207'
  | 'unknown-208'
  | 'unknown-209'
  | 'unknown-210'
  | 'unknown-211'
  | 'unknown-212'
  | 'unknown-213'
  | 'unknown-214'
  | 'unknown-215'
  | 'unknown-216'
  | 'unknown-217'
  | 'unknown-218'
  | 'unknown-219'
  | 'unknown-220'
  | 'unknown-221'
  | 'unknown-222'
  | 'unknown-223'
  | 'unknown-224'
  | 'unknown-225'
  | 'unknown-226'
  | 'unknown-227'
  | 'unknown-228'
  | 'unknown-229'
  | 'unknown-230'
  | 'unknown-231'
  | 'unknown-232'
  | 'unknown-233'
  | 'unknown-234'
  | 'unknown-235'
  | 'unknown-236'
  | 'unknown-237'
  | 'unknown-238'
  | 'unknown-239'
  | 'unknown-240'
  | 'unknown-241'
  | 'unknown-242'
  | 'unknown-243'
  | 'unknown-244'
  | 'unknown-245'
  | 'unknown-246'
  | 'unknown-247'
  | 'unknown-248'
  | 'unknown-249'
  | 'unknown-250'
  | 'unknown-251'
  | 'unknown-252'
  | 'unknown-253'
  | 'unknown-254'
  | 'unknown-255'
  | 'unknown-256'
  | 'unknown-257'
  | 'unknown-258'
  | 'unknown-259'
  | 'unknown-260'
  | 'unknown-261'
  | 'unknown-262'
  | 'unknown-263'
  | 'unknown-264'
  | 'unknown-265'
  | 'unknown-266'
  | 'unknown-267'
  | 'unknown-268'
  | 'unknown-269'
  | 'unknown-270'
  | 'unknown-271'
  | 'unknown-272'
  | 'unknown-273'
  | 'unknown-274'
  | 'unknown-275'
  | 'unknown-276'
  | 'unknown-277'
  | 'unknown-278'
  | 'unknown-279'
  | 'unknown-280'
  | 'unknown-281'
  | 'unknown-282'
  | 'unknown-283'
  | 'unknown-284'
  | 'unknown-285'
  | 'unknown-286'
  | 'unknown-287'
  | 'unknown-288'
  | 'unknown-289'
  | 'unknown-290'
  | 'unknown-291'
  | 'unknown-292'
  | 'unknown-293'
  | 'unknown-294'
  | 'unknown-295'
  | 'unknown-296'
  | 'unknown-297'
  | 'unknown-298'
  | 'unknown-299'
  | 'unknown-300'
  | 'unknown-301'
  | 'unknown-302'
  | 'unknown-303'
  | 'unknown-304'
  | 'unknown-305'
  | 'unknown-306'
  | 'unknown-307'
  | 'unknown-308'
  | 'unknown-309'
  | 'unknown-310'
  | 'unknown-311'
  | 'unknown-312'
  | 'unknown-313'
  | 'unknown-314'
  | 'unknown-315'
  | 'unknown-316'
  | 'unknown-317'
  | 'unknown-318'
  | 'unknown-319'
  | 'unknown-320'
  | 'unknown-321'
  | 'unknown-322'
  | 'unknown-323'
  | 'unknown-324'
  | 'unknown-325'
  | 'unknown-326'
  | 'unknown-327'
  | 'unknown-328'
  | 'unknown-329'
  | 'unknown-330'
  | 'unknown-331'
  | 'unknown-332'
  | 'unknown-333'
  | 'unknown-334'
  | 'unknown-335'
  | 'unknown-336'
  | 'unknown-337'
  | 'unknown-338'
  | 'unknown-339'
  | 'unknown-340'
  | 'unknown-341'
  | 'unknown-342'
  | 'unknown-343'
  | 'unknown-344'
  | 'unknown-345'
  | 'unknown-346'
  | 'unknown-347'
  | 'unknown-348'
  | 'unknown-349'
  | 'unknown-350'
  | 'unknown-351'
  | 'unknown-352'
  | 'unknown-353'
  | 'unknown-354'
  | 'unknown-355'
  | 'unknown-356'
  | 'unknown-357'
  | 'unknown-358'
  | 'unknown-359'
  | 'unknown-360'
  | 'unknown-361'
  | 'unknown-362'
  | 'unknown-363'
  | 'unknown-364'
  | 'unknown-365'
  | 'unknown-366'
  | 'unknown-367'
  | 'unknown-368'
  | 'unknown-369'
  | 'unknown-370'
  | 'unknown-371'
  | 'unknown-372'
  | 'unknown-373'
  | 'unknown-374'
  | 'unknown-375'
  | 'unknown-376'
  | 'unknown-377'
  | 'unknown-378'
  | 'unknown-379'
  | 'unknown-380'
  | 'unknown-381'
  | 'unknown-382'
  | 'unknown-383'
  | 'unknown-384'
  | 'unknown-385'
  | 'unknown-386'
  | 'unknown-387'
  | 'unknown-388'
  | 'unknown-389'
  | 'unknown-390'
  | 'unknown-391'
  | 'unknown-392'
  | 'unknown-393'
  | 'unknown-394'
  | 'unknown-395'
  | 'unknown-396'
  | 'unknown-397'
  | 'unknown-398'
  | 'unknown-399'
  | 'unknown-400'
  | 'unknown-401'
  | 'unknown-402'
  | 'unknown-403'
  | 'unknown-404'
  | 'unknown-405'
  | 'unknown-406'
  | 'unknown-407'
  | 'unknown-408'
  | 'unknown-409'
  | 'unknown-410'
  | 'unknown-411'
  | 'unknown-412'
  | 'unknown-413'
  | 'unknown-414'
  | 'unknown-415'
  | 'unknown-416'
  | 'unknown-417'
  | 'unknown-418'
  | 'unknown-419'
  | 'unknown-420'
  | 'unknown-421'
  | 'unknown-422'
  | 'unknown-423'
  | 'unknown-424'
  | 'unknown-425'
  | 'unknown-426'
  | 'unknown-427'
  | 'unknown-428'
  | 'unknown-429'
  | 'unknown-430'
  | 'unknown-431'
  | 'unknown-432'
  | 'unknown-433'
  | 'unknown-434'
  | 'unknown-435'
  | 'unknown-436'
  | 'unknown-437'
  | 'unknown-438'
  | 'unknown-439'
  | 'unknown-440'
  | 'unknown-441'
  | 'unknown-442'
  | 'unknown-443'
  | 'unknown-444'
  | 'unknown-445'
  | 'unknown-446'
  | 'unknown-447'
  | 'unknown-448'
  | 'unknown-449'
  | 'unknown-450'
  | 'unknown-451'
  | 'unknown-452'
  | 'unknown-453'
  | 'unknown-454'
  | 'unknown-455'
  | 'unknown-456'
  | 'unknown-457'
  | 'unknown-458'
  | 'unknown-459'
  | 'unknown-460'
  | 'unknown-461'
  | 'unknown-462'
  | 'unknown-463'
  | 'unknown-464'
  | 'unknown-465'
  | 'unknown-466'
  | 'unknown-467'
  | 'unknown-468'
  | 'unknown-469'
  | 'unknown-470'
  | 'unknown-471'
  | 'unknown-472'
  | 'unknown-473'
  | 'unknown-474'
  | 'unknown-475'
  | 'unknown-476'
  | 'unknown-477'
  | 'unknown-478'
  | 'unknown-479'
  | 'unknown-480'
  | 'unknown-481'
  | 'unknown-482'
  | 'unknown-483'
  | 'unknown-484'
  | 'unknown-485'
  | 'unknown-486'
  | 'unknown-487'
  | 'unknown-488'
  | 'unknown-489'
  | 'unknown-490'
  | 'unknown-491'
  | 'unknown-492'
  | 'unknown-493'
  | 'unknown-494'
  | 'unknown-495'
  | 'unknown-496'
  | 'unknown-497'
  | 'unknown-498'
  | 'unknown-499'
  | 'unknown-500'
  | 'unknown-501'
  | 'unknown-502'
  | 'unknown-503'
  | 'unknown-504'
  | 'unknown-505'
  | 'unknown-506'
  | 'unknown-507'
  | 'unknown-508'
  | 'unknown-509'
  | 'unknown-510'
  | 'unknown-511'
  | 'unknown-512'
  | 'unknown-513'
  | 'unknown-514'
  | 'unknown-515'
  | 'unknown-516'
  | 'unknown-517'
  | 'unknown-518'
  | 'unknown-519'
  | 'unknown-520'
  | 'unknown-521'
  | 'unknown-522'
  | 'unknown-523'
  | 'unknown-524'
  | 'unknown-525'
  | 'unknown-526'
  | 'unknown-527'
  | 'unknown-528'
  | 'unknown-529'
  | 'unknown-530'
  | 'unknown-531'
  | 'unknown-532'
  | 'unknown-533'
  | 'unknown-534'
  | 'unknown-535'
  | 'unknown-536'
  | 'unknown-537'
  | 'unknown-538'
  | 'unknown-539'
  | 'unknown-540'
  | 'unknown-541'
  | 'unknown-542'
  | 'unknown-543'
  | 'unknown-544'
  | 'unknown-545'
  | 'unknown-546'
  | 'unknown-547'
  | 'unknown-548'
  | 'unknown-549'
  | 'unknown-550'
  | 'unknown-551'
  | 'unknown-552'
  | 'unknown-553'
  | 'unknown-554'
  | 'unknown-555'
  | 'unknown-556'
  | 'unknown-557'
  | 'unknown-558'
  | 'unknown-559'
  | 'unknown-560'
  | 'unknown-561'
  | 'unknown-562'
  | 'unknown-563'
  | 'unknown-564'
  | 'unknown-565'
  | 'unknown-566'
  | 'unknown-567'
  | 'unknown-568'
  | 'unknown-569'
  | 'unknown-570'
  | 'unknown-571'
  | 'unknown-572'
  | 'unknown-573'
  | 'unknown-574'
  | 'unknown-575'
  | 'unknown-576'
  | 'unknown-577'
  | 'unknown-578'
  | 'unknown-579'
  | 'unknown-580'
  | 'unknown-581'
  | 'unknown-582'
  | 'unknown-583'
  | 'unknown-584'
  | 'unknown-585'
  | 'unknown-586'
  | 'unknown-587'
  | 'unknown-588'
  | 'unknown-589'
  | 'unknown-590'
  | 'unknown-591'
  | 'unknown-592'
  | 'unknown-593'
  | 'unknown-594'
  | 'unknown-595'
  | 'unknown-596'
  | 'unknown-597'
  | 'unknown-598'
  | 'unknown-599'
  | 'unknown-600'
  | 'unknown-601'
  | 'unknown-602'
  | 'unknown-603'
  | 'unknown-604'
  | 'unknown-605'
  | 'unknown-606'
  | 'unknown-607'
  | 'unknown-608'
  | 'unknown-609'
  | 'unknown-610'
  | 'unknown-611'
  | 'unknown-612'
  | 'unknown-613'
  | 'unknown-614'
  | 'unknown-615'
  | 'unknown-616'
  | 'unknown-617'
  | 'unknown-618'
  | 'unknown-619'
  | 'unknown-620'
  | 'unknown-621'
  | 'unknown-622'
  | 'unknown-623'
  | 'unknown-624'
  | 'unknown-625'
  | 'unknown-626'
  | 'unknown-627'
  | 'unknown-628'
  | 'unknown-629'
  | 'unknown-630'
  | 'unknown-631'
  | 'unknown-632'
  | 'unknown-633'
  | 'unknown-634'
  | 'unknown-635'
  | 'unknown-636'
  | 'unknown-637'
  | 'unknown-638'
  | 'unknown-639'
  | 'vit-boost'
  | 'vit-down'
  | 'warding-circle'
  | 'weakness'
  | 'weakness-ii'
  | 'weight';
