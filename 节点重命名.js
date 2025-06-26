/**
 * @name Contextual Renamer (Flag Priority + Code Fallback)
 * @description 根据节点名中的国旗或国家代码，精确识别并替换为中文。优先匹配国旗；若无国旗，则匹配代码(长代码优先)并自动添加国旗。
 * @version 16.0 (Major Refactor)
 * @update 2025-06-26
 * @author Gemini
 * @usage 在 Sub-Store 中使用。脚本会自动应用重命名规则。
 */

// --- 数据源 ---
// prettier-ignore
const FG = ['🇭🇰','🇲🇴','🇹🇼','🇯🇵','🇰🇷','🇸🇬','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇦🇺','🇦🇪','🇦🇫','🇦🇱','🇩🇿','🇦🇴','🇦🇷','🇦🇲','🇦🇹','🇦🇿','🇧🇭','🇧🇩','🇧🇾','🇧🇪','🇧🇿','🇧🇯','🇧🇹','🇧🇴','🇧🇦','🇧🇼','🇧🇷','🇻🇬','🇧🇳','🇧🇬','🇧🇫','🇧🇮','🇰🇭','🇨🇲','🇨🇦','🇨🇻','🇰🇾','🇨🇫','🇹🇩','🇨🇱','🇨🇴','🇰🇲','🇨🇬','🇨🇩','🇨🇷','🇭🇷','🇨🇾','🇨🇿','🇩🇰','🇩🇯','🇩🇴','🇪🇨','🇪🇬','🇸🇻','🇬🇶','🇪🇷','🇪🇪','🇪🇹','🇫🇯','🇫🇮','🇬🇦','🇬🇲','🇬🇪','🇬🇭','🇬🇷','🇬🇱','🇬🇹','🇬🇳','🇬🇾','🇭🇹','🇭🇳','🇭🇺','🇮🇸','🇮🇳','🇮🇩','🇮🇷','🇮🇶','🇮🇪','🇮🇲','🇮🇱','🇮🇹','🇨🇮','🇯🇲','🇯🇴','🇰🇿','🇰🇪','🇰🇼','🇰🇬','🇱🇦','🇱🇻','🇱🇧','🇱🇸','🇱🇷','🇱🇾','🇱🇹','🇱🇺','🇲🇰','🇲🇬','🇲🇼','🇲🇾','🇲🇻','🇲🇱','🇲🇹','🇲🇷','🇲🇺','🇲🇽','🇲🇩','🇲🇨','🇲🇳','🇲🇪','🇲🇦','🇲🇿','🇲🇲','🇳🇦','🇳🇵','🇳🇱','🇳🇿','🇳🇮','🇳🇪','🇳🇬','🇰🇵','🇳🇴','🇴🇲','🇵🇰','🇵🇦','🇵🇾','🇵🇪','🇵🇭','🇵🇹','🇵🇷','🇶🇦','🇷🇴','🇷🇺','🇷🇼','🇸🇲','🇸🇦','🇸🇳','🇷🇸','🇸🇱','🇸🇰','🇸🇮','🇸🇴','🇿🇦','🇪🇸','🇱🇰','🇸🇩','🇸🇷','SZ','🇸🇪','🇨🇭','🇸🇾','🇹🇯','🇹🇿','🇹🇭','🇹🇬','🇹🇴','🇹🇹','🇹🇳','🇹🇷','🇹🇲','🇻🇮','🇺🇬','🇺🇦','🇺🇾','🇺🇿','🇻🇪','🇻🇳','🇾🇪','🇿🇲','🇿🇼','🇦🇩','🇷🇪','🇵🇱','🇬🇺','🇻🇦','🇱🇮','🇨🇼','🇸🇨','🇦🇶','🇬🇮','🇨🇺','🇫🇴','🇦🇽','🇧🇲','🇹🇱'];
// prettier-ignore
const EN = ['HK','MO','TW','JP','KR','SG','US','GB','FR','DE','AU','AE','AF','AL','DZ','AO','AR','AM','AT','AZ','BH','BD','BY','BE','BZ','BJ','BT','BO','BA','BW','BR','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CO','KM','CG','CD','CR','HR','CY','CZ','DK','DJ','DO','EC','EG','SV','GQ','ER','EE','ET','FJ','FI','GA','GM','GE','GH','GR','GL','GT','GN','GY','HT','HN','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','CI','JM','JO','KZ','KE','KW','KG','LA','LV','LB','LS','LR','LY','LT','LU','MK','MG','MW','MY','MV','ML','MT','MR','MU','MX','MD','MC','MN','ME','MA','MZ','MM','NA','NP','NL','NZ','NI','NE','NG','KP','NO','OM','PK','PA','PY','PE','PH','PT','PR','QA','RO','RU','RW','SM','SA','SN','RS','SL','SK','SI','SO','ZA','ES','LK','SD','SR','SZ','SE','CH','SY','TJ','TZ','TH','TG','TO','TT','TN','TR','TM','VI','UG','UA','UY','UZ','VE','VN','YE','ZM','ZW','AD','RE','PL','GU','VA','LI','CW','SC','AQ','GI','CU','FO','AX','BM','TL'];
// prettier-ignore
const EN3 = ['HKG','MAC','TWN','JPN','KOR','SGP','USA','GBR','FRA','DEU','AUS','ARE','AFG','ALB','DZA','AGO','ARG','ARM','AUT','AZE','BHR','BGD','BLR','BEL','BLZ','BEN','BTN','BOL','BIH','BWA','BRA','VGB','BRN','BGR','BFA','BDI','KHM','CMR','CAN','CPV','CYM','CAF','TCD','CHL','COL','COM','COG','COD','CRI','HRV','CYP','CZE','DNK','DJI','DOM','ECU','EGY','SLV','GNQ','ERI','EST','ETH','FJI','FIN','GAB','GMB','GEO','GHA','GRC','GRL','GTM','GIN','GUY','HTI','HND','HUN','ISL','IND','IDN','IRN','IRQ','IRL','IMN','ISR','ITA','CIV','JAM','JOR','KAZ','KEN','KWT','KGZ','LAO','LVA','LBN','LSO','LBR','LBY','LTU','LUX','MKD','MDG','MWI','MYS','MDV','MLI','MLT','MRT','MUS','MEX','MDA','MCO','MNG','MNE','MAR','MOZ','MMR','NAM','NPL','NLD','NZL','NIC','NER','NGA','PRK','NOR','OMN','PAK','PAN','PRY','PER','PHL','PRT','PRI','QAT','ROU','RUS','RWA','SMR','SAU','SEN','SRB','SLE','SVK','SVN','SOM','ZAF','ESP','LKA','SDN','SUR','SWZ','SWE','CHE','SYR','TJK','TZA','THA','TGO','TON','TTO','TUN','TUR','TKM','VIR','UGA','UKR','URY','UZB','VEN','VNM','YEM','ZMB','ZWE','AND','REU','POL','GUM','VAT','LIE','CUW','SYC','ATA','GIB','CUB','FRO','ALA','BMU','TLS'];
// prettier-ignore
const QC = ['Hong Kong','Macao','Taiwan','Japan','South Korea','Singapore','United States','United Kingdom','France','Germany','Australia','United Arab Emirates','Afghanistan','Albania','Algeria','Angola','Argentina','Armenia','Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands','Central African Republic','Chad','Chile','Colombia','Comoros','Congo-Brazzaville','Congo-Kinshasa','Costa Rica','Croatia','Cyprus','Czech Republic','Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Fiji','Finland','Gabon','Gambia','Georgia','Ghana','Greece','Greenland','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Ivory Coast','Jamaica','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Lithuania','Luxembourg','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (Burma)','Namibia','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','Norway','Oman','Pakistan','Panama','Paraguay','Peru','Philippines','Portugal','Puerto Rico','Qatar','Romania','Russia','Rwanda','San Marino','Saudi Arabia','Senegal','Serbia','Sierra Leone','Slovakia','Slovenia','Somalia','South Africa','Spain','Sri Lanka','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','U.S. Virgin Islands','Uganda','Ukraine','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Andorra','Reunion','Poland','Guam','Vatican','Liechtenstein','Curacao','Seychelles','Antarctica','Gibraltar','Cuba','Faroe Islands','Aland Islands','Bermuda','Timor-Leste'];
// prettier-ignore
const ZH = ['香港','澳门','台湾','日本','韩国','新加坡','美国','英国','法国','德国','澳大利亚','阿联酋','阿富汗','阿尔巴尼亚','阿尔及利亚','安哥拉','阿根廷','亚美尼亚','奥地利','阿塞拜疆','巴林','孟加拉国','白俄罗斯','比利时','伯利兹','贝宁','不丹','玻利维亚','波斯尼亚和黑塞哥维那','博茨瓦纳','巴西','英属维尔京群岛','文莱','保加利亚','布基纳法索','布隆迪','柬埔寨','喀麦隆','加拿大','佛得角','开曼群岛','中非共和国','乍得','智利','哥伦比亚','科摩罗','刚果(布)','刚果(金)','哥斯达黎加','克罗地亚','塞浦路斯','捷克','丹麦','吉布提','多米尼加共和国','厄瓜多尔','埃及','萨尔瓦多','赤道几内亚','厄立特里亚','爱沙尼亚','埃塞俄比亚','斐济','芬兰','加蓬','冈比亚','格鲁지아','加纳','希腊','格陵兰','危地马拉','几内亚','圭亚那','海地','洪都拉斯','匈牙利','冰岛','印度','印尼','伊朗','伊拉克','爱尔兰','马恩岛','以色列','意大利','科特迪瓦','牙买加','约旦','哈萨克斯坦','肯尼亚','科威特','吉尔吉斯斯坦','老挝','拉脱维亚','黎巴嫩','莱索托','利比里亚','利比亚','立陶宛','卢森堡','马其顿','马达加斯加','马拉维','马来西亚','马尔代夫','马里','马耳他','毛利塔尼亚','毛里求斯','墨西哥','摩尔多瓦','摩纳哥','蒙古','黑山共和国','摩洛哥','莫桑比克','缅甸','纳米比亚','尼泊尔','荷兰','新西兰','尼加拉瓜','尼日尔','尼日利亚','朝鲜','挪威','阿曼','巴基斯坦','巴拿马','巴拉圭','秘鲁','菲律宾','葡萄牙','波多黎各','卡塔尔','罗马尼亚','俄罗斯','卢旺达','圣马力诺','沙特阿拉伯','塞内加尔','塞尔维亚','塞拉利昂','斯洛伐克','斯洛文尼亚','索马里','南非','西班牙','斯里兰卡','苏丹','苏里南','斯威士兰','瑞典','瑞士','叙利亚','塔吉克斯坦','坦桑尼亚','泰国','多哥','汤加','特立尼达和多巴哥','突尼斯','土耳其','土库曼斯坦','美属维尔京群岛','乌干达','乌克兰','乌拉圭','乌兹别克斯坦','委内瑞拉','越南','也门','赞比亚','津巴布韦','安道尔','留尼汪','波兰','关岛','梵地冈','列支敦士登','库拉索','塞舌尔','南极','直布罗陀','古巴','法罗群岛','奥兰群岛','百慕达','东帝汶'];
const aliasMap = {
  '英国': ['UK'], '阿联酋': ['Dubai'], '土耳其': ['Türkiye'], '捷克': ['Czech'],
  '意大利': ['Italia'], '德国': ['Deutschland'], '西班牙': ['España']
};

// --- 预处理，构建高效的数据库 ---

// 1. 创建一个统一的、包含所有国家/地区信息的数据库
let countryDatabase = [];
for (let i = 0; i < FG.length; i++) {
  countryDatabase.push({
    flag: FG[i],
    zh: ZH[i],
    // 将所有可能的代码放入一个集合中，自动去重
    codes: new Set([EN[i], EN3[i], QC[i]].filter(Boolean))
  });
}

// 2. 将别名添加到数据库中
for (const [zhName, enAliases] of Object.entries(aliasMap)) {
  const country = countryDatabase.find(c => c.zh === zhName);
  if (country) {
    for (const alias of enAliases) {
      country.codes.add(alias);
    }
  }
}

// 3. 特殊处理：台湾(TW)数据指向中国(CN)
const cnData = {
    flag: '🇨🇳',
    zh: '中国',
    codes: new Set(['CN', 'CHN', 'China'])
};
const twData = countryDatabase.find(c => c.flag === '🇹🇼');
if (twData) {
    twData.codes.forEach(code => cnData.codes.add(code));
}
// 从数据库中移除台湾，并添加/更新中国的数据
countryDatabase = countryDatabase.filter(c => c.flag !== '🇹🇼');
countryDatabase.unshift(cnData); // 将中国数据放在最前面

// 4. 为两个核心匹配阶段创建优化的数据结构

// `flagToDataMap`: 用于优先匹配带国旗的节点 (Phase 1)
const flagToDataMap = new Map(countryDatabase.map(c => [c.flag, c]));

// `allCodesSorted`: 用于无国旗节点的代码匹配 (Phase 2)
// 将所有代码展平，并附上其归属的国家信息
// 按代码长度降序排序，确保优先匹配长代码 (e.g., 'USA' before 'US')
const allCodesSorted = countryDatabase
  .flatMap(country => Array.from(country.codes).map(code => ({
      code: code,
      flag: country.flag,
      zh: country.zh
  })))
  .sort((a, b) => b.code.length - a.code.length);


// --- 主操作函数 ---
function operator(proxies) {
  return proxies.map(p => {
    let nodeName = p.name;
    let matched = false;

    // --- Phase 1: 优先匹配国旗 ---
    // 如果节点名中已包含国旗，则只在原地替换英文代码
    for (const [flag, country] of flagToDataMap.entries()) {
      if (nodeName.includes(flag)) {
        // 获取这个国家的所有代码，并按长度降序排序
        const sortedCodes = Array.from(country.codes).sort((a, b) => b.length - a.length);
        for (const code of sortedCodes) {
          // 创建一个精确匹配整个单词的正则表达式 (忽略大小写)
          const regex = new RegExp('\\b' + code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
          if (regex.test(nodeName)) {
            nodeName = nodeName.replace(regex, country.zh);
            matched = true;
            break; // 替换成功后，跳出当前国家代码的循环
          }
        }
        if (matched) break; // 找到并处理完国旗后，跳出国家循环
      }
    }

    // --- Phase 2: 无国旗时，匹配代码并添加国旗 ---
    // 如果阶段1没有匹配成功，则进入此阶段
    if (!matched) {
      for (const item of allCodesSorted) {
        const regex = new RegExp('\\b' + item.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (regex.test(nodeName)) {
          // 匹配成功，先替换代码为中文，再在最前面加上国旗
          nodeName = (item.flag + ' ' + nodeName.replace(regex, item.zh));
          // 无需设置 matched = true，因为匹配到最长的就会 break
          break; // 找到第一个（即最长的）匹配项后，立即停止搜索
        }
      }
    }
    
    // 统一对最终的节点名进行格式化（合并多余空格并去除首尾空格）
    p.name = nodeName.replace(/\s+/g, ' ').trim();
    return p;
  });
}
