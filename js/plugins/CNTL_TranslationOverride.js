/*:
 * @target MZ
 * @plugindesc v1.0.0 Runtime translation and UI overrides (load last).
 * @author CNTL
 *
 * @param testMode
 * @text Debug: log untranslated text
 * @type boolean
 * @default false
 * @desc When true, logs Chinese UI strings that have no entry in textMap.
 *
 * @help
 * CNTL_TranslationOverride.js
 *
 * Applies English translations and layout fixes at runtime so you do not
 * need to edit core/plugin files after each game update.
 *
 * Load this plugin LAST in Plugin Manager (after Phileas_TextWrap and
 * all game plugins it patches).
 *
 * Layers:
 *   1. textMap       - plain string replacements (extend as needed)
 *   2. drawText hooks - auto-apply textMap on drawText / drawTextEx
 *   3. windowHooks   - per-window method overrides for layout/logic
 *
 * See CNTL_TranslationOverride_README.md for the game-update workflow.
 *
 * @orderAfter CNTL---Phileas_TextWrap
 * @orderAfter Admin_LanguageCore
 * @orderAfter Cat_FinalSceneUi
 * @orderAfter Cat_ShopCoreUi
 * @orderAfter XdRs_LL_Windows
 * @orderAfter Cat_NewWindow
 * @orderAfter FlyCat_LL_SceneMenu
 */

(() => {
  "use strict";

  const PLUGIN_NAME = "CNTL_TranslationOverride";
  const parameters = PluginManager.parameters(PLUGIN_NAME);
  const TEST_MODE = parameters["testMode"] === "true";
  if (!localStorage.getItem("GameLanguage")) return;
  const isEnglish = JSON.parse(localStorage.getItem("GameLanguage")).type === 3;
  if (!isEnglish) return;

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  function aliasMethod(object, name, fn) {
    const origin = object[name];
    if (typeof origin !== "function") {
      console.warn(`[${PLUGIN_NAME}] Cannot alias ${name}: not a function`);
      return false;
    }
    object[name] = function (...args) {
      return fn.call(this, origin, ...args);
    };
    return true;
  }

  function hasChinese(text) {
    return /[\u4e00-\u9fff]/.test(String(text));
  }

  function applyTextMap(text) {
    if (text == null || text === "") return text;
    let s = String(text);
    if (TEXT_MAP[s] !== undefined) return TEXT_MAP[s];
    const keys = TEXT_MAP_SORTED;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (s.includes(key)) {
        s = s.split(key).join(TEXT_MAP[key]);
      }
    }
    if (TEST_MODE && hasChinese(s)) {
      console.warn(`[${PLUGIN_NAME}] Untranslated:`, s.slice(0, 120));
    }
    return s;
  }

  // ---------------------------------------------------------------------------
  // textMap — add entries here when you find new Chinese UI strings
  // ---------------------------------------------------------------------------

  const TEXT_MAP = {
    //STAGES CULTIVATION
    "练气巅峰": "Luyện Khí Đỉnh Phong",
    "筑基初期": "Trúc Cơ Sơ Kỳ",
    "筑基中期": "Trúc Cơ Trung Kỳ",
    "筑基后期": "Trúc Cơ Hậu Kỳ",
    "筑基巅峰": "Trúc Cơ Đỉnh Phong",
    "金丹前期": "Kim Đan Sơ Kỳ",
    "金丹中期": "Kim Đan Trung Kỳ",
    "金丹后期": "Kim Đan Hậu Kỳ",
    "金丹巅峰": "Kim Đan Đỉnh Phong",
    "元婴前期": "Nguyên Anh Sơ Kỳ",
    "元婴中期": "Nguyên Anh Trung Kỳ",
    "元婴后期": "Nguyên Anh Hậu Kỳ",
    "元婴巅峰": "Nguyên Anh Đỉnh Phong",
    "化神前期": "Hóa Thần Sơ Kỳ",
    "化神中期": "Hóa Thần Trung Kỳ",
    "化神后期": "Hóa Thần Hậu Kỳ",
    "化神巅峰": "Hóa Thần Đỉnh Phong",
    "炼虚前期": "Luyện Hư Sơ Kỳ",
    "炼虚中期": "Luyện Hư Trung Kỳ",
    "炼虚后期": "Luyện Hư Hậu Kỳ",
    "炼虚巅峰": "Luyện Hư Đỉnh Phong",
    "合体前期": "Hợp Thể Sơ Kỳ",
    "合体中期": "Hợp Thể Trung Kỳ",
    "合体后期": "Hợp Thể Hậu Kỳ",
    "合体巅峰": "Hợp Thể Đỉnh Phong",
    "大乘前期": "Đại Thừa Sơ Kỳ",
    "大乘中期": "Đại Thừa Trung Kỳ",
    "大乘后期": "Đại Thừa Hậu Kỳ",
    "大乘巅峰": "Đại Thừa Đỉnh Phong",
    "渡劫前期": "Độ Kiếp Sơ Kỳ",
    "渡劫中期": "Độ Kiếp Trung Kỳ",
    "渡劫后期": "Độ Kiếp Hậu Kỳ",
    "渡劫巅峰": "Độ Kiếp Đỉnh Phong",
    "劫境一重天": "Thiên Kiếp Cảnh Nhất Trọng Thiên",
    "劫境二重天": "Thiên Kiếp Cảnh Nhị Trọng Thiên",
    "劫境三重天": "Thiên Kiếp Cảnh Tam Trọng Thiên",
    "劫境四重天": "Thiên Kiếp Cảnh Tứ Trọng Thiên",
    "劫境五重天": "Thiên Kiếp Cảnh Ngũ Trọng Thiên",
    "劫境六重天": "Thiên Kiếp Cảnh Lục Trọng Thiên",
    "劫境七重天": "Thiên Kiếp Cảnh Thất Trọng Thiên",
    "劫境八重天": "Thiên Kiếp Cảnh Bát Trọng Thiên",
    "劫境九重天": "Thiên Kiếp Cảnh Cửu Trọng Thiên",

    //QUESTS MENU
    主线任务: "Nhiệm vụ chính",
    支线任务: "Nhiệm vụ phụ",
    未完成: "Đang tiến hành",
    已完成: "Đã hoàn thành",

    //QUESTS Title
    与大师兄对话: "Nói chuyện với Đại Sư Huynh",
    初到流云城: "Lần đầu đến Lưu Vân Thành",
    第一次炼丹: "Lần đầu luyện đan",
    第一次突破: "Lần đầu đột phá",
    秘境出现: "Bí cảnh xuất hiện",
    探索秘境: "Khám phá bí cảnh",
    继续探索: "Tiếp tục khám phá",
    购买戒指: "Mua giới chỉ",
    深入秘境: "Đi sâu vào bí cảnh",
    黑蛟的要求: "Yêu cầu của Hắc Giao",
    前往皇朝: "Đến Hoàng triều",
    和阿欢对话: "Nói chuyện với A Hoan",
    前往凤来楼: "Đến Phượng Lai Lâu",
    与阿欢对话: "Nói chuyện với A Hoan",
    与墨轩对话: "Nói chuyện với Mặc Hiên",
    醉仙居线路: "Tuyến đường Túy Tiên Cư",
    居民线路: "Tuyến đường dân cư",
    回家对话阿欢: "Về nhà nói chuyện với A Hoan",
    前往桃花村: "Đến Đào Hoa Thôn",
    帮助桃花村民: "Giúp đỡ dân làng Đào Hoa Thôn",
    桃花村的秘密: "Bí mật của Đào Hoa Thôn",
    寻找虫穴入口: "Tìm lối vào Trùng Huyệt",
    重回皇都: "Trở lại Hoàng Đô",
    进入王府: "Vào Vương Phủ",
    前往军妓馆: "Đến Quân Kỹ Quán",
    前往西北军营: "Đến doanh trại quân đội Tây Bắc",
    前往凤临阁: "Đến Phượng Lâm Các",
    再次进入王府: "Vào Vương Phủ một lần nữa",
    前往魔界: "Đến Ma Giới",
    前往江南: "Đến Giang Nam",
    获得真相: "Tìm ra chân tướng",
    消灭水灾: "Giải trừ nạn lũ lụt",
    获得打神鞭: "Nhận được Đả Thần Tiên",
    杀了皇帝: "Giết Hoàng đế",
    最终一战: "Trận chiến cuối cùng",
    加入其他宗门: "Gia nhập tông môn khác",
    开启天元境: "Mở Thiên Nguyên Cảnh",
    血洗琉璃岛: "Tắm máu Lưu Ly Đảo",
    获得万魂幡: "Nhận được Vạn Hồn Phiên",
    与魔尊结盟: "Kết minh với Ma Tôn",
    战胜魔尊: "Đánh bại Ma Tôn",
    最终战天尊: "Quyết chiến với Thiên Tôn",
    第一次突破境界: "Lần đầu đột phá cảnh giới",
    桃花村的道具店: "Tiệm đạo cụ Đào Hoa Thôn",
    墨轩的要求: "Yêu cầu của Mặc Hiên",

    // SIDE QUESTS
    讨债刘癞子: "Đòi nợ Lưu Lại Tử",
    "【流云城赌场任务】": "【Nhiệm vụ Sòng bạc Lưu Vân Thành】",
    "内容：刘癞子欠了赌场大量灵石。":
      "Nội dung: Lưu Lại Tử nợ sòng bạc một lượng lớn Linh Thạch.",
    "地点：前往流云城城门口左边的茅草屋。":
      "Địa điểm: Đến ngôi nhà tranh bên trái cổng thành Lưu Vân.",
    "目标：从 刘癞子 身上获得欠款。":
      "Mục tiêu: Thu hồi món nợ từ Lưu Lại Tử.",
    "提交：\\c[5]赌场\\c[0]": "Giao cho: \\c[5]Sòng bạc\\c[0]",
    "——————————————————————————————————————":
      "——————————————————————————————————————",
    "报酬：\\c[6] 灵石(200~250); \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (200~250);\\c[0]",
    "周期：月": "Chu kỳ: Hàng tháng",
    "任务完成，前往赌场交付。": "Nhiệm vụ hoàn thành, đến sòng bạc bàn giao.",
    引诱城主: "Quyến rũ Thành chủ",
    "内容：为了赌场能够继续开下去，":
      "Nội dung: Để sòng bạc tiếp tục hoạt động,",
    "  赌场邀约年轻女子色诱城主。":
      "Sòng bạc mời các cô gái trẻ dùng sắc đẹp quyến rũ Thành Chủ.",
    "地点：流云城城主府大门处":
      "Địa điểm: Tại cổng Phủ Thành chủ Lưu Vân Thành.",
    "目标：与NPC对话，完成剧情。":
      "Mục tiêu: Nói chuyện với NPC và hoàn thành cốt truyện.",
    "报酬：\\c[6] 灵石(350~400); \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (350~400);\\c[0]",
    追回抵账物: "Lấy lại vật thế chấp",
    "内容：有小偷进入赌场偷走了抵债物。":
      "Nội dung: Có tên trộm đột nhập sòng bạc lấy trộm vật thế chấp.",
    "  现在小偷应该还在流云城。": "Hiện tại tên trộm vẫn còn ở Lưu Vân Thành.",
    "地点：流云城武器店附近":
      "Địa điểm: Gần tiệm vũ khí Lưu Vân Thành.",
    "目标：战胜黑衣人小偷": "Mục tiêu: Đánh bại tên trộm hắc y.",
    "报酬：\\c[6]灵石(150~180); \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (150~180);\\c[0]",
    送信药店老板: "Đưa thư cho chủ tiệm thuốc",
    "【城主府任务】": "【Nhiệm vụ Phủ Thành Chủ】",
    "内容：将信件送给收件人药店老板娘。":
      "Nội dung: Giao thư cho người nhận là bà chủ tiệm thuốc.",
    "地点：前往流云药品店，可以寻路，可以快捷键R显示":
      "Địa điểm: Đến tiệm thuốc Lưu Vân, có thể tự động tìm đường hoặc nhấn phím tắt R để hiển thị.",
    "目标：和 药店老板娘 对话": "Mục tiêu: Nói chuyện với bà chủ tiệm thuốc.",
    "提交：流云城城主府大门 \\c[5]孙武\\c[0]":
      "Giao cho: \\c[5]Tôn Ngũ\\c[0] tại cổng Phủ Thành Chủ Lưu Vân Thành.",
    "报酬：\\c[6]灵石(50);积分牌(1) \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (50); Thẻ Điểm (1)\\c[0]",
    "任务完成，前往城主府门口交付任务。":
      "Nhiệm vụ hoàn thành, đến cổng Phủ Thành Chủ để giao trả nhiệm vụ.",
    送信云梦阁小二: "Đưa thư cho tiểu nhị Vân Mộng Các",
    "内容：将信件送给收件人吴小山。":
      "Nội dung: Giao thư cho người nhận là Ngô Tiểu Sơn.",
    "地点：前往流云城云梦阁，可以寻路，可以快捷键R显示":
      "Địa điểm: Đến Vân Mộng Các tại Lưu Vân Thành, có thể tự động tìm đường hoặc nhấn phím tắt R để hiển thị.",
    "目标：与 吴小山 对话": "Mục tiêu: Nói chuyện với Ngô Tiểu Sơn.",
    "报酬：\\c[6]灵石(50);积分牌(1)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (50); Thẻ Điểm (1)\\c[0]",
    送信给孔玲: "Đưa thư cho Khổng Linh",
    "内容：将信件送给收件人孔玲。":
      "Nội dung: Giao thư cho người nhận là Khổng Linh.",
    "地点：前往流云城找到孔玲，可以寻路，可以快捷键R显示":
      "Địa điểm: Đến Lưu Vân Thành tìm Khổng Linh, có thể tự động tìm đường hoặc nhấn phím tắt R để hiển thị.",
    "目标：与 孔玲 对话": "Mục tiêu: Nói chuyện với Khổng Linh.",
    送信给穆云峰: "Đưa thư cho Mục Vân Phong",
    "内容：将信件送给收件人穆云峰。":
      "Nội dung: Giao thư cho người nhận là Mục Vân Phong.",
    "地点：前往流云城找到穆云峰，可以寻路，可以快捷键R显示":
      "Địa điểm: Đến Lưu Vân Thành tìm Mục Vân Phong, có thể tự động tìm đường hoặc nhấn phím tắt R để hiển thị.",
    "目标：和 穆云峰 对话": "Mục tiêu: Nói chuyện với Mục Vân Phong.",
    打造洞府: "Xây dựng động phủ",
    "【杜云任务】": "【Nhiệm vụ Đỗ Vân】",
    "内容：获得宗门分配洞府 ,不过尚未修缮，":
      "Nội dung: Nhận được động phủ do tông môn phân phối, nhưng vẫn chưa được tu sửa.",
    "  筹备10W银两招募凡人修建洞府。":
      "Cần chuẩn bị 100.000 lượng bạc để thuê phàm nhân xây dựng động phủ.",
    "  (银两可在琉璃村 李洪波 处兑换)":
      "(Bạc có thể đổi tại Lý Hồng Ba ở Lưu Ly Thôn)",
    "地点：琉璃村工匠 周影": "Địa điểm: Thợ thủ công Lưu Ly Thôn — Chu Ảnh.",
    "目标：聘请 周影 打造专属洞府":
      "Mục tiêu: Thuê Chu Ảnh để xây dựng động phủ riêng.",
    "报酬：\\c[6]专属洞府开启\\c[0]":
      "Phần thưởng: \\c[6]Mở khóa động phủ riêng\\c[0]",
    讨伐狸力: "Thảo phạt Ly Lực",
    "内容：琉璃岛野外经常出没的狸力。":
      "Nội dung: Ly Lực thường xuyên xuất hiện ở vùng hoang dã đảo Lưu Ly.",
    "  修士和凡人不注意会被狸力盯上，会穷追不舍。":
      "Tu sĩ và phàm nhân nếu không chú ý sẽ bị Ly Lực nhắm vào, truy đuổi không buông.",
    "  为了控制狸力数量，邀请修士消灭10只狸力。":
      "Để kiểm soát số lượng Ly Lực, tông môn mời tu sĩ tiêu diệt 10 con Ly Lực.",
    "地点：流云城野外": "Địa điểm: Ngoại ô Lưu Vân Thành.",
    "目标：击杀10只狸力": "Mục tiêu: Tiêu diệt 10 con Ly Lực.",
    "报酬：\\c[6]灵石(200);积分牌(5)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (200); Thẻ Điểm (5)\\c[0]",
    "周期：春": "Chu kỳ: Mùa xuân",
    春季种植: "Trồng trọt mùa xuân",
    "内容：琉璃村应季种植人手不多，需要修士帮忙，":
      "Nội dung: Lưu Ly Thôn vào vụ gieo trồng đang thiếu nhân lực, cần tu sĩ giúp đỡ,",
    " 凡帮忙的修士都会得到一笔不错的灵石。":
      "Tất cả tu sĩ tham gia giúp đỡ đều sẽ nhận được một khoản Linh Thạch hậu hĩnh.",
    "地点：琉璃村杂货店门口NPC王二对话":
      "Địa điểm: Đến tiệm tạp hóa Lưu Ly Thôn nói chuyện với NPC Vương Nhị.",
    "目标：和王二对话(寻路)，协助种植":
      "Mục tiêu: Nói chuyện với Vương Nhị (tự động tìm đường) và hỗ trợ trồng trọt.",
    "报酬：\\c[6]灵石(100);积分牌(3)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (100); Thẻ Điểm (3)\\c[0]",
    救助伤员: "Cứu trợ người bị thương",
    "内容：近日有魔修骚扰，有部分受伤修士前往琉璃村修养。":
      "Nội dung: Gần đây có ma tu quấy rối, có một số tu sĩ bị thương đã đến thôn Lưu Ly dưỡng thương.",
    "  急需修士前去帮助。":
      "Đang rất cần tu sĩ đến trợ giúp.",
    "地点：琉璃村废弃房屋": "Địa điểm: Ngôi nhà hoang ở Lưu Ly Thôn.",
    "目标：进入房间，帮助救助伤员":
      "Mục tiêu: Vào phòng và giúp trị thương cho thương viên.",
    "周期：夏": "Chu kỳ: Mùa hạ",
    购买冰灵瓜: "Mua Dưa Băng Linh",
    "内容：夏日炎炎，为了避暑，城主购买大批冰灵瓜分":
      "Nội dung: Mùa hè oi bức, để tránh nóng, Thành chủ đã mua một lượng lớn Băng Linh Qua để chia",
    " 发给修士。请一些修士帮忙将买好的冰灵瓜带回":
      "phát cho tu sĩ. Cần một số tu sĩ giúp vận chuyển Băng Linh Qua đã mua về",
    " 流云城。": "Lưu Vân Thành.",
    "地点：琉璃村西瓜田附近":
      "Địa điểm: Gần ruộng dưa hấu ở Lưu Ly Thôn.",
    "目标：与吴鑫NPC对话": "Mục tiêu: Nói chuyện với NPC Ngô Hâm.",
    "报酬：\\c[6]灵石(100);积分牌(2)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (100); Thẻ Điểm (2)\\c[0]",
    秋收粮食: "Thu hoạch lương thực mùa thu",
    "内容：琉璃村的田地到了收获的季节。因为琉璃村人口有限，":
      "Nội dung: Ruộng đất ở Lưu Ly Thôn đã đến mùa thu hoạch. Do nhân khẩu trong thôn có hạn,",
    "  需要修士前往帮忙收割。":
      "cần tu sĩ đến giúp đỡ gặt hái.",
    "地点：琉璃村杂货店附近":
      "Địa điểm: Gần tiệm tạp hóa Lưu Ly Thôn.",
    "目标：与王二NPC对话": "Mục tiêu: Nói chuyện với NPC Vương Nhị.",
    "报酬：\\c[6]灵石(200);积分牌(3)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (200); Thẻ Điểm (3)\\c[0]",
    "周期：秋": "Chu kỳ: Mùa thu",
    丰收祭: "Lễ hội mùa màng",
    "内容：又到每年一次的琉璃村丰收祭，广大修士可以":
      "Nội dung: Lại đến Lễ hội mùa màng thường niên của Lưu Ly Thôn, đông đảo tu sĩ có thể",
    "  前往参加，城主府为此准备了丰富的奖励。":
      "đến tham gia, Thành Chủ Phủ đã chuẩn bị phần thưởng phong phú cho việc này.",
    "地点：琉璃村祭祀台旁":
      "Địa điểm: Bên cạnh đài tế lễ Lưu Ly Thôn.",
    "目标：与老温NPC对话": "Mục tiêu: Nói chuyện với NPC Lão Ôn.",
    "报酬：\\c[6]灵石(150);积分牌(5)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (150); Thẻ Điểm (5)\\c[0]",
    镇压山贼: "Trấn áp sơn tặc",
    "内容：琉璃村后山居住着一群山贼，平时还算本分，":
      "Nội dung: Trên hậu sơn Lưu Ly Thôn có một nhóm sơn tặc cư ngụ, bình thường khá bổn phận,",
    "  到了冬天总要出来扰民，为此特请修士前去镇压。":
      "nhưng đến mùa đông thường ra ngoài quấy nhiễu dân chúng, vì vậy đặc biệt mời tu sĩ đến trấn áp.",
    "地点：琉璃村后山最上面":
      "Địa điểm: Đỉnh hậu sơn Lưu Ly Thôn.",
    "目标：击败山贼首领": "Mục tiêu: Đánh bại thủ lĩnh sơn tặc.",
    "报酬：\\c[6]灵石(300);积分牌(7)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (300); Thẻ Điểm (7)\\c[0]",
    "周期：冬": "Chu kỳ: Mùa đông",
    送温暖: "Gửi tặng ấm áp",
    "内容：冬季来临，城主担忧琉璃村凡人食物短缺。":
      "Nội dung: Mùa đông đến, Thành chủ lo lắng phàm nhân ở Lưu Ly Thôn bị thiếu lương thực.",
    " 每年冬天都会送一批粮食给予，特请修士帮忙送达。":
      "Mỗi mùa đông đều sẽ gửi tặng một đợt lương thực, đặc biệt mời tu sĩ giúp đỡ vận chuyển.",
    "地点：琉璃村村长家": "Địa điểm: Nhà Trưởng thôn Lưu Ly Thôn.",
    "目标：与村长对话": "Mục tiêu: Nói chuyện với Trưởng thôn.",
    "报酬：\\c[6]灵石(100);积分牌(4)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (100); Thẻ Điểm (4)\\c[0]",
    妖兽出没: "Yêu thú xuất hiện",
    "内容：有妖兽出没到了琉璃塔附近的树林里":
      "Nội dung: Có yêu thú xuất hiện ở khu rừng gần Lưu Ly Tháp,",
    "  还请修士前往降服。": "Xin mời tu sĩ đến thu phục.",
    "地点：琉璃塔下面树林": "Địa điểm: Khu rừng dưới Lưu Ly Tháp.",
    "目标：击败幽冥花": "Mục tiêu: Đánh bại U Minh Hoa.",
    "报酬：\\c[6]灵石(255);积分牌(3)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (255); Thẻ Điểm (3)\\c[0]",
    魔修兄妹出没: "Huynh muội Ma tu xuất hiện",
    "内容：有一对魔修兄妹，经常出没琉璃塔附近残害路":
      "Nội dung: Có một cặp huynh muội Ma tu thường xuyên xuất hiện quanh Lưu Ly Tháp hại người,",
    " 过修士，希望有志修士前往降服他们。":
      "hy vọng tu sĩ có chí hướng đến thu phục bọn họ.",
    "地点：琉璃塔左边山上":
      "Địa điểm: Trên núi bên trái Lưu Ly Tháp,",
    "目标：击败魔修兄妹": "Mục tiêu: Đánh bại huynh muội Ma tu.",
    "报酬：\\c[6]灵石(240);积分牌(2)\\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (240); Thẻ Điểm (2)\\c[0]",
    击杀鼓: "Tiêu diệt Cổ",
    "【桃花村任务】": "【Nhiệm vụ Đào Hoa Thôn】",
    "内容：前往琉璃村后山山顶，使用\\C[2]1份大米、2只鸡、":
      "Nội dung: Đến đỉnh hậu sơn Lưu Ly Thôn, sử dụng\\C[2]1 phần gạo, 2 con gà,",
    "  1份香\\C[0]召唤山神鼓，所需材料在皇城可以购买。":
      "1 nén nhang\\C[0] để triệu hồi Sơn Thần Cổ, nguyên liệu cần thiết có thể mua tại Hoàng Thành.",
    "地点：琉璃村后山": "Địa điểm: Hậu sơn Lưu Ly Thôn.",
    "目标：召唤山神并击败": "Mục tiêu: Triệu hồi Sơn Thần và đánh bại.",
    "————————————————————————————————————————————————":
      "————————————————————————————————————————————————",
    "报酬：紫英草(1)": "Phần thưởng: Tử Anh Thảo (1).",
    凯瑟琳的请求: "Yêu cầu của Catherine",
    "内容：前往皇城药店购买以下药材：":
      "Nội dung: Đến tiệm thuốc Hoàng Thành mua các dược liệu sau:",
    " \\C[2]生黄芪 3颗   白僵蚕  2颗 \\C[0]":
      "\\C[2]Sinh Hoàng Kỳ 3 củ, Bạch Cương Tàm 2 con\\C[0]",
    " \\C[2]毒针   10颗   狌狌皮毛  5颗 \\C[0]":
      "\\C[2]Độc Châm 10 cái, Da Lông Tinh Tinh 5 cái\\C[0]",
    "地点：皇城药店 琉璃塔附近":
      "Địa điểm: Tiệm thuốc Hoàng Thành gần Lưu Ly Tháp.",
    "目标：提交相关道具": "Mục tiêu: Giao các đạo cụ liên quan.",
    "提交：凯瑟琳": "Giao cho: Catherine",
    "报酬：\\c[6]元婴期材料店开启；魔女服(1); \\c[0]":
      "Phần thưởng: \\c[6]Mở tiệm nguyên liệu Nguyên Anh; Trang phục Ma Nữ (1);\\c[0]",
    时空隧道: "Đường hầm thời không",
    "【流云城任务】": "【Nhiệm vụ Lưu Vân Thành】",
    "内容：前往流云城城里对话绫罗，获得更多时空隧道信息。":
      "Nội dung: Đến Lưu Vân Thành nói chuyện với Lăng La để biết thêm thông tin về đường hầm thời không.",
    "  找到时空隧道，告诉给绫罗。":
      "Tìm được đường hầm thời không rồi báo lại cho Lăng La.",
    "地点：流云城城内": "Địa điểm: Trong Lưu Vân Thành.",
    "目标：对话绫罗(寻路)": "Mục tiêu: Nói chuyện với Lăng La (tìm đường).",
    "提交：绫罗": "Giao cho: Lăng La.",
    "报酬：\\c[6]时装·清月(1);\\c[0]":
      "Phần thưởng: \\c[6]Thời Trang · Thanh Nguyệt (1);\\c[0]",
    精气功德收集: "Thu thập Tinh Khí và Công Đức",
    "【墨轩任务】": "【Nhiệm vụ Mặc Hiên】",
    "内容：可以用精气瓶收集隐晦角落的精气，或者直接引诱男人获得。":
      "Nội dung: Có thể dùng bình tinh khí để thu thập tinh khí ở các góc khuất, hoặc trực tiếp quyến rũ đàn ông để hấp thu.",
    "  功德必须去佛宗接功德任务(精气有图标提示)。":
      "Công đức phải đến Phật Tông nhận nhiệm vụ công đức (tinh khí sẽ có biểu tượng gợi ý).",
    "地点：佛宗及世界各处":
      "Địa điểm: Phật Tông và các nơi trên thế giới.",
    "目标：收集精气与功德": "Mục tiêu: Thu thập tinh khí và công đức.",
    "报酬：\\c[6]黑龙进化度+1\\c[0]":
      "Phần thưởng: \\c[6]Độ tiến hóa Hắc Long +1\\c[0]",
    提供金乌丹: "Cung cấp Kim Ô Đan",
    "【佛宗任务】": "【Nhiệm vụ Phật Tông】",
    "内容：炼制或者购买10份金乌丹提供给消灭魔修的修士。":
      "Nội dung: Luyện chế hoặc mua 10 phần Kim Ô Đan để cung cấp cho các tu sĩ đang tiêu diệt Ma tu.",
    "地点：佛宗": "Địa điểm: Phật Tông.",
    "目标：收集10份金乌丹。": "Mục tiêu: Thu thập 10 viên Kim Ô Đan.",
    "提交：佛宗宽远大师": "Giao cho: Khoan Viễn Đại Sư (Phật Tông).",
    "报酬：\\c[6]功德(2); \\c[0]": "Phần thưởng: \\c[6]Công Đức (2); \\c[0]",
    "前往佛宗任务处交任务。":
      "Đến ban nhiệm vụ Phật Tông để giao trả nhiệm vụ.",
    帮忙救助病人: "Giúp đỡ cứu chữa người bệnh",
    "内容：前往皇城平民区救助受伤凡人":
      "Nội dung: Đến khu bình dân Hoàng Thành để cứu trợ phàm nhân bị thương,",
    "地点：皇城平民区": "Địa điểm: Khu bình dân Hoàng Thành.",
    "目标：流云城药店购买一些药材，随机触发事件":
      "Mục tiêu: Mua một số dược liệu ở tiệm thuốc Lưu Vân Thành, kích hoạt sự kiện ngẫu nhiên.",
    "报酬：\\c[6]功德(5); \\c[0]": "Phần thưởng: \\c[6]Công Đức (5); \\c[0]",
    血战魔修: "Huyết chiến Ma tu",
    "内容：大地图随机出现魔修":
      "Nội dung: Ma tu xuất hiện ngẫu nhiên trên đại bản đồ",
    "地点：大地图": "Địa điểm: Đại bản đồ.",
    "目标：战胜魔修": "Mục tiêu: Đánh bại Ma tu.",
    "报酬：\\c[6]灵石(300);功德(8); \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (300); Công Đức (8);\\c[0]",
    桃花村除虫: "Diệt côn trùng ở Đào Hoa Thôn",
    "内容：深夜桃花村有虫子出没，袭击村民。":
      "Nội dung: Đêm muộn Đào Hoa Thôn có sâu bọ xuất hiện quấy nhiễu, tấn công thôn dân.",
    "地点：桃花村": "Địa điểm: Đào Hoa Thôn.",
    "目标：夜晚进入桃花村，杀死5只虫子。":
      "Mục tiêu: Vào Đào Hoa Thôn vào ban đêm, tiêu diệt 5 con sâu bọ.",
    "报酬：\\c[6]灵石(500);功德(5); \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (500); Công Đức (5);\\c[0]",
    "普度众生❤": "Phổ độ chúng sinh ❤",
    "内容：为了让单身丧偶男子体验温情，特设普度众生内容。":
      "Nội dung: Để giúp những nam nhân độc thân hoặc góa vợ trải nghiệm sự ấm áp, đặc biệt thiết lập nội dung Phổ Độ Chúng Sinh.",
    "  为众生谋福利。": "Mưu cầu phúc lợi cho chúng sinh.",
    "地点：佛宗偏殿": "Địa điểm: Thiên điện Phật Tông.",
    "目标：前往佛宗偏殿(必须是女修)":
      "Mục tiêu: Đến thiên điện Phật Tông (phải là nữ tu).",
    "报酬：\\c[6]灵石(1000);功德(20); \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (1000); Công Đức (20);\\c[0]",
    寻找特殊剑修: "Tìm kiếm kiếm tu đặc biệt",
    "【傲天门任务】": "【Nhiệm vụ Ngạo Thiên Môn】",
    "内容：帮助傲天门神剑剑灵寻找拥有先天剑体的剑修成为他的主人。":
      "Nội dung: Giúp kiếm linh của Ngạo Thiên Môn Thần Kiếm tìm kiếm kiếm tu sở hữu Tiên Thiên Kiếm Thể để nhận chủ.",
    "地点：傲天门": "Địa điểm: Ngạo Thiên Môn.",
    "目标：和傲天门周景初对话，引诱周景初拔起神剑。":
      "Mục tiêu: Nói chuyện với Chu Cảnh Sơ của Ngạo Thiên Môn, dẫn dụ y rút Thần Kiếm.",
    "报酬：\\c[6]灵石(2000); \\c[0]":
      "Phần thưởng: \\c[6]Linh Thạch (2000);\\c[0]",
    "任务已完成，和神剑对话。": "Nhiệm vụ đã hoàn thành, nói chuyện với Thần Kiếm.",
    宗门巡逻: "Tuần tra tông môn",
    "【炎心阁任务】": "【Nhiệm vụ Viêm Tâm Các】",
    "任务内容：在炎心阁宗门内四处查看，与出没的灵兽和奇怪的人战斗":
      "Nội dung nhiệm vụ: Đi tuần tra xung quanh Viêm Tâm Các, chiến đấu với linh thú xuất hiện hoặc kẻ khả nghi.",
    "任务地点：炎心阁宗门室外":
      "Địa điểm nhiệm vụ: Bên ngoài Viêm Tâm Các.",
    "如何进行：在炎心阁室外四处乱走":
      "Cách thực hiện: Đi dạo xung quanh bên ngoài Viêm Tâm Các.",
    "报酬：15宗门贡献": "Phần thưởng: 15 cống hiến tông môn.",
    "提示：只要战斗三次就算成功。":
      "Gợi ý: Chỉ cần chiến đấu 3 lần là thành công.",
    "已做完，前往交付任务。": "Đã hoàn thành, đi bàn giao nhiệm vụ.",
    "物品购买.甲": "Mua sắm vật phẩm - Giáp",
    "任务内容：购买5份幻银矿": "Nội dung nhiệm vụ: Mua 5 phần Huyễn Ngân Quặng.",
    "任务地点：流云城武器店":
      "Địa điểm nhiệm vụ: Tiệm vũ khí Lưu Vân Thành.",
    "如何进行：对应地点道具店购买":
      "Cách thực hiện: Đến tiệm đạo cụ tương ứng để mua.",
    "报酬：20宗门贡献": "Phần thưởng: 20 cống hiến tông môn.",
    "提示：无": "Gợi ý: Không có.",
    "物品购买.乙": "Mua sắm vật phẩm - Ất",
    "任务内容：购买5份幻彩丝": "Nội dung nhiệm vụ: Mua 5 phần Tơ Huyễn Sắc.",
    "任务地点：流云城服装店":
      "Địa điểm nhiệm vụ: Tiệm y phục Lưu Vân Thành.",
    "物品购买.丙": "Mua sắm vật phẩm - Bính",
    "任务内容：购买5份二阶妖丹": "Nội dung nhiệm vụ: Mua 5 phần Nhị Giai Yêu Đan.",
    "任务地点：流云城赌场、望月阁、城主府":
      "Địa điểm nhiệm vụ: Sòng bạc Lưu Vân Thành, Vọng Nguyệt Các, Thành Chủ Phủ.",
    "击杀内鬼.甲": "Diệt nội gián - Giáp",
    "任务内容：在皇城贫民区击杀隐藏在炎心阁的魔修":
      "Nội dung nhiệm vụ: Đến khu bần dân Hoàng Thành để tiêu diệt Ma tu ẩn náu trong Viêm Tâm Các.",
    "任务地点：皇城贫民区": "Địa điểm nhiệm vụ: Khu bần dân Hoàng Thành.",
    "如何进行：找到皇城贫民区的魔修":
      "Cách thực hiện: Tìm ra Ma tu tại khu bần dân Hoàng Thành.",
    "报酬：30宗门贡献": "Phần thưởng: 30 cống hiến tông môn.",
    "提示：战胜就可": "Gợi ý: Đánh bại mục tiêu là được.",
    "击杀内鬼.乙": "Diệt nội gián - Ất",
    "任务内容：在流云城郊外击杀隐藏在炎心阁的魔修":
      "Nội dung nhiệm vụ: Đến ngoại ô Lưu Vân Thành để tiêu diệt Ma tu ẩn náu trong Viêm Tâm Các.",
    "任务地点：流云城郊外": "Địa điểm nhiệm vụ: Ngoại ô Lưu Vân Thành.",
    "如何进行：找到流云城郊外的魔修":
      "Cách thực hiện: Tìm ra Ma tu ở ngoại ô Lưu Vân Thành.",
    "击杀内鬼.丙": "Diệt nội gián - Bính",
    "任务内容：在桃花村近击杀隐藏在炎心阁的魔修":
      "Nội dung nhiệm vụ: Đến phụ cận Đào Hoa Thôn để tiêu diệt Ma tu ẩn náu trong Viêm Tâm Các.",
    "任务地点：桃花村": "Địa điểm nhiệm vụ: Đào Hoa Thôn.",
    "如何进行：找到桃花村的魔修":
      "Cách thực hiện: Tìm ra Ma tu ở Đào Hoa Thôn.",
    "南笙的要求.甲": "Yêu cầu của Nam Sênh - Giáp",
    "【流云城NPC任务】": "【Nhiệm vụ NPC Lưu Vân Thành】",
    "任务内容：穿着南笙给的肚兜，一个月交给南笙。":
      "Nội dung nhiệm vụ: Mặc yếm Nam Sênh đưa, sau một tháng giao trả lại cho cô ấy.",
    "任务地点：流云城": "Địa điểm nhiệm vụ: Lưu Vân Thành.",
    "如何进行：拿到南笙给的肚兜，度过一个月。":
      "Cách thực hiện: Nhận yếm của Nam Sênh và mặc trong vòng một tháng.",
    "报酬：50灵石 2声望": "Phần thưởng: 50 Linh Thạch, 2 Danh vọng.",
    "提示：拿到南笙的肚兜休息一个月就可以":
      "Gợi ý: Nhận yếm của Nam Sênh rồi về nhà nghỉ ngơi qua một tháng.",
    "已做完，交付给南笙。": "Đã hoàn thành, giao cho Nam Sênh.",
    "南笙的要求.乙": "Yêu cầu của Nam Sênh - Ất",
    "任务内容：接到任务后回家休息，不清理腋下然后再找南笙。":
      "Nội dung nhiệm vụ: Nhận nhiệm vụ xong thì về nhà nghỉ ngơi, không vệ sinh vùng nách rồi quay lại tìm Nam Sênh.",
    "如何进行：休息一个月，选择不清理腋下。":
      "Cách thực hiện: Nghỉ ngơi một tháng, chọn không vệ sinh vùng nách.",
    "报酬：100灵石 2声望": "Phần thưởng: 100 Linh Thạch, 2 Danh vọng.",
    "提示：休息一个获得腋下生香状态后找南笙":
      "Gợi ý: Nghỉ ngơi qua một tháng để nhận trạng thái 'Nách Tỏa Hương', sau đó đi tìm Nam Sênh.",
    "南笙的要求.丙": "Yêu cầu của Nam Sênh - Bính",
    "任务内容：穿着南笙给的丝袜，一个月交给南笙。":
      "Nội dung nhiệm vụ: Mặc tất chân Nam Sênh đưa, sau một tháng giao trả lại cho cô ấy.",
    "如何进行：拿到南笙给的丝袜，度过一个月。":
      "Cách thực hiện: Nhận tất chân của Nam Sênh và mặc trong vòng một tháng.",
    "报酬：120灵石 3声望": "Phần thưởng: 120 Linh Thạch, 3 Danh vọng.",
    "提示：拿到南笙的丝袜休息一个月就可以":
      "Gợi ý: Nhận tất chân của Nam Sênh rồi về nhà nghỉ ngơi qua một tháng.",
    "孔玲的要求.甲": "Yêu cầu của Khổng Linh - Giáp",
    "任务内容：购买一颗乌金丹给孔玲。":
      "Nội dung nhiệm vụ: Mua một viên Ô Kim Đan cho Khổng Linh.",
    "如何进行：去药店买乌金丹，然后给孔玲。":
      "Cách thực hiện: Đến tiệm thuốc mua Ô Kim Đan rồi giao cho Khổng Linh.",
    "报酬：1声望": "Phần thưởng: 1 Danh vọng.",
    "已做完，交付给孔玲。": "Đã hoàn thành, giao cho Khổng Linh.",
    "孔玲的要求.乙": "Yêu cầu của Khổng Linh - Ất",
    "任务内容：收集5颗毒针给孔玲。":
      "Nội dung nhiệm vụ: Thu thập 5 Độc Châm cho Khổng Linh.",
    "任务地点：琉璃塔": "Địa điểm nhiệm vụ: Tháp Lưu Ly.",
    "如何进行：去琉璃塔打怪物钦原毒针，然后给孔玲。":
      "Cách thực hiện: Đến Lưu Ly Tháp đánh quái vật Khâm Nguyên để thu thập Độc Châm, sau đó giao cho Khổng Linh.",
    "王志的要求.甲": "Yêu cầu của Vương Chí - Giáp",
    "任务内容：怀孕后找王志，喂奶":
      "Nội dung nhiệm vụ: Sau khi mang thai thì đi tìm Vương Chí để cho bú sữa.",
    "如何进行：怀孕": "Cách thực hiện: Mang thai.",
    "已做完，请找王志。": "Đã hoàn thành, vui lòng tìm Vương Chí.",
    "王志的要求.乙": "Yêu cầu của Vương Chí - Ất",
    "任务内容：怀孕后找王志，做爱。":
      "Nội dung nhiệm vụ: Sau khi mang thai thì đi tìm Vương Chí để song tu.",
    穆云峰的要求: "Yêu cầu của Mục Vân Phong",
    "任务内容：与穆云峰来一场你来我往的做爱。":
      "Nội dung nhiệm vụ: Cùng Mục Vân Phong tiến hành một trận song tu nồng nhiệt.",
    "如何进行：继续点击对话": "Cách thực hiện: Tiếp tục nhấp vào đối thoại.",
    "报酬：100灵石 1声望": "Phần thưởng: 100 Linh Thạch, 1 Danh vọng.",
    "已做完，请找穆云峰。": "Đã hoàn thành, vui lòng tìm Mục Vân Phong.",
    绫罗的要求: "Yêu cầu của Lăng La",
    "任务内容：流云城野外打出狸力，出5份烤肉给绫罗。":
      "Nội dung nhiệm vụ: Đánh bại Ly Lực ở ngoại ô Lưu Vân Thành để thu thập 5 phần Thịt Nướng giao cho Lăng La.",
    "如何进行：打狸力，获得烤肉。":
      "Cách thực hiện: Đánh bại Ly Lực để thu thập Thịt Nướng.",
    "已做完，请找绫罗。": "Đã hoàn thành, vui lòng tìm Lăng La.",
    "桃小妖的请求.甲": "Yêu cầu của Đào Tiểu Yêu - Giáp",
    "【桃花村NPC任务】": "【Nhiệm vụ NPC Đào Hoa Thôn】",
    "任务内容：拥有青鸾后，在与桃小夭对话。":
      "Nội dung nhiệm vụ: Sau khi sở hữu Thanh Loan, tiến hành nói chuyện với Đào Tiểu Yêu.",
    "如何进行：对话。": "Cách thực hiện: Đối thoại.",
    "报酬：50灵石 1声望 2功德":
      "Phần thưởng: 50 Linh Thạch, 1 Danh Vọng, 2 Công Đức",
    "已做完，请找桃小夭。": "Đã hoàn thành, vui lòng tìm Đào Tiểu Yêu.",
    "桃小妖的请求.乙": "Yêu cầu của Đào Tiểu Yêu - Ất",
    "任务内容：前往皇城，钓鱼那购买5条小鱼。":
      "Nội dung nhiệm vụ: Đến Hoàng Thành, mua 5 con cá nhỏ từ chỗ người câu cá.",
    "如何进行：购买小鱼，给桃小夭":
      "Cách thực hiện: Mua cá nhỏ rồi giao cho Đào Tiểu Yêu.",
    "报酬：50灵石 2声望 1功德":
      "Phần thưởng: 50 Linh Thạch, 2 Danh Vọng, 1 Công Đức",
    拯救村民: "Giải cứu dân làng",
    "【皇城衙门任务】": "【Nhiệm vụ Nha Môn Hoàng Thành】",
    "任务内容：前往大地图随机进入开启的村庄拯救村民。":
      "Nội dung nhiệm vụ: Di chuyển trên đại bản đồ, ngẫu nhiên tiến vào các thôn trang đang mở để giải cứu thôn dân.",
    "任务地点：山海村、固若村和明然村":
      "Địa điểm nhiệm vụ: Sơn Hải Thôn, Cố Nhược Thôn và Minh Nhiên Thôn.",
    "如何进行：进入": "Cách thực hiện: Tiến vào.",
    "报酬：100两 2声望 5功德": "Phần thưởng: 100 lượng, 2 Danh Vọng, 5 Công Đức.",
    "已做完，请找皇城贵族区的周志文提交任务。":
      "Đã hoàn thành, vui lòng tìm Chu Chí Văn ở khu quý tộc Hoàng Thành để giao trả nhiệm vụ.",
    王晓玲的要求: "Yêu cầu của Vương Tiểu Linh",
    "【琉璃村NPC任务】": "【Nhiệm vụ NPC Lưu Ly Thôn】",
    "任务内容：琉璃村刘汉家购买甜甜的水果给王晓玲。":
      "Nội dung nhiệm vụ: Đến nhà Lưu Hán ở Lưu Ly Thôn mua trái cây ngọt cho Vương Tiểu Linh.",
    "任务地点：琉璃村": "Địa điểm nhiệm vụ: Lưu Ly Thôn.",
    "如何进行：琉璃村刘汉家购买甜甜的水果。":
      "Cách thực hiện: Đến nhà Lưu Hán ở Lưu Ly Thôn mua trái cây ngọt.",
    "已做完，请找王晓玲。": "Đã hoàn thành, vui lòng tìm Vương Tiểu Linh.",
    万起落的要求: "Yêu cầu của Vạn Khởi Lạc",
    "【皇城NPC任务】": "【Nhiệm vụ NPC Hoàng Thành】",
    "任务内容：皇城万起落想要1份祝馀治疗自己的身体。":
      "Nội dung nhiệm vụ: Vạn Khởi Lạc ở Hoàng Thành muốn có 1 phần Chúc Dư để chữa trị thân thể.",
    "任务地点：皇城": "Địa điểm nhiệm vụ: Hoàng Thành.",
    "如何进行：接了任务后，前往皇城药店购买。":
      "Cách thực hiện: Nhận nhiệm vụ xong, đến tiệm thuốc Hoàng Thành để mua.",
    "报酬：30灵石 1声望 2功德":
      "Phần thưởng: 30 Linh Thạch, 1 Danh Vọng, 2 Công Đức",
    "已做完，请找万起落。": "Đã hoàn thành, vui lòng tìm Vạn Khởi Lạc.",
    周若的要求: "Yêu cầu của Chu Nhược",
    "任务内容：皇城周若想要1颗金乌丹治疗自己的身体。":
      "Nội dung nhiệm vụ: Chu Nhược ở Hoàng Thành muốn có 1 viên Kim Ô Đan để chữa trị thân thể.",
    "如何进行：接了任务后，前往流云城药店购买或者自己炼制。":
      "Cách thực hiện: Nhận nhiệm vụ xong, đến tiệm thuốc Lưu Vân Thành mua hoặc tự luyện chế.",
    "报酬：30灵石 3声望 4功德":
      "Phần thưởng: 30 Linh Thạch, 3 Danh Vọng, 4 Công Đức",
    "已做完，请找周若。": "Đã hoàn thành, vui lòng tìm Chu Nhược.",
    虔诚信徒顾雪莹: "Tín đồ thành tâm Cố Tuyết Oánh",
    "【佛宗支线】": "【Nhiệm vụ phụ Phật Tông】",
    "任务内容：佛宗信徒顾雪莹期待自己能和男友相爱一辈子。":
      "Nội dung nhiệm vụ: Cố Tuyết Oánh, tín đồ Phật Tông mong muốn trọn đời được bên nhau với đạo lữ của mình.",
    "任务地点：佛宗": "Địa điểm nhiệm vụ: Phật Tông.",
    "如何进行：对话后触发该任务，过一个月后前往大世界佛宗":
      "Cách thực hiện: Sau khi đối thoại sẽ kích hoạt nhiệm vụ, sau một tháng hãy đến khu vực Phật Tông trên đại bản đồ",
    "附近，坐上飞行法宝，再附近一个闪烁的圆圈接触后触发":
      "gần đó, ngồi lên phi hành pháp bảo, tiếp cận vòng tròn phát sáng ở khu vực lân cận để kích hoạt",
    "后续剧情。": "Tình tiết tiếp theo.",
    "报酬：100灵石 1声望 2功德":
      "Phần thưởng: 100 Linh Thạch, 1 Danh Vọng, 2 Công Đức",
    "如何进行：前往皇城的入口铁匠铺或者贵族区的衙门口，触发":
      "Cách thực hiện: Đến tiệm rèn ở cổng vào Hoàng Thành hoặc nha môn khu quý tộc để kích hoạt",
    "寻人启事后，前往鲛人界。":
      "thông báo tìm người, sau đó đi đến Giao Nhân Giới.",
    "报酬：100灵石 2声望 2功德":
      "Phần thưởng: 100 Linh Thạch, 2 Danh Vọng, 2 Công Đức",
    "任务地点：鲛人界豪宅里": "Địa điểm nhiệm vụ: Trong biệt phủ Giao Nhân Giới.",
    "如何进行：进去后，根据堕落度，要不让顾雪莹留在鲛人界，":
      "Cách thực hiện: Sau khi tiến vào, tùy thuộc vào độ đọa lạc, hoặc là để Cố Tuyết Oánh ở lại Giao Nhân Giới,",
    "要不带顾雪莹回到皇城。": "hoặc đưa Cố Tuyết Oánh trở về Hoàng Thành.",
    "报酬：100灵石 3声望 1功德":
      "Phần thưởng: 100 Linh Thạch, 3 Danh Vọng, 1 Công Đức",
    "任务已完成。": "Nhiệm vụ đã hoàn thành.",
    佛宗秘密: "Bí mật của Phật Tông",
    "任务内容：佛宗里的小和尚似乎害怕什么，但他很想尝尝甜":
      "Nội dung nhiệm vụ: Tiểu hòa thượng ở Phật Tông dường như đang sợ hãi điều gì đó, nhưng cậu rất muốn nếm thử xem",
    "甜的水果是什么味道，为了直到小和尚害怕的事情，请前往":
      "trái cây ngọt có mùi vị thế nào. Để biết được điều tiểu hòa thượng sợ hãi, hãy đến",
    "琉璃岛琉璃村购买甜甜的水果。":
      "Lưu Ly Thôn trên Lưu Ly Đảo để mua trái cây ngọt.",
    "任务地点：琉璃岛琉璃村": "Địa điểm nhiệm vụ: Lưu Ly Thôn, Lưu Ly Đảo.",
    "如何进行：对话后触发该任务，前往琉璃岛琉璃村田地附近":
      "Cách thực hiện: Sau khi đối thoại sẽ kích hoạt nhiệm vụ, hãy đến khu vực gần ruộng đất Lưu Ly Thôn trên Lưu Ly Đảo",
    "的房子，里面有个男子在贩卖各种水果书籍等。":
      "ở trong căn nhà có một nam tử đang bán các loại trái cây và sách vở.",
    "任务内容：佛宗里似乎有什么人在抓上香的人，不限男女，":
      "Nội dung nhiệm vụ: Ở Phật Tông dường như có người đang bắt cóc người dâng hương, không phân biệt nam nữ,",
    "目前没有更多的线索，可以前往佛宗弟子房，多接触那些":
      "Hiện tại không còn manh mối gì thêm, có thể đến phòng đệ tử Phật Tông, tiếp xúc nhiều hơn với các",
    "弟子，或许会有线索。": "đệ tử, có lẽ sẽ tìm được manh mối.",
    "任务地点：佛宗弟子房": "Địa điểm nhiệm vụ: Phòng đệ tử Phật Tông.",
    "如何进行：尝试和弟子房的弟子们进行交流，可以用点方法":
      "Cách thực hiện: Cố gắng giao tiếp với các đệ tử trong đệ tử phòng, có thể dùng một số thủ đoạn",
    "使他们开口，获得需要的线索。":
      "khiến bọn họ mở miệng để có được manh mối cần thiết.",
    "任务内容：原来一切都是佛宗之前天骄坐化后导致的，为了":
      "Nội dung nhiệm vụ: Hóa ra mọi chuyện đều do Thiên Kiêu đời trước của Phật Tông sau khi tọa hóa gây ra, để",
    "见到那个天骄，必须给悟芯大师1000灵石。":
      "gặp được vị Thiên Kiêu đó, phải giao cho Ngộ Tâm Đại Sư 1000 Linh Thạch.",
    "任务地点：佛宗大雄宝殿": "Địa điểm nhiệm vụ: Đại Hùng Bảo Điện Phật Tông.",
    "如何进行：准备好1000灵石给悟芯":
      "Cách thực hiện: Chuẩn bị sẵn 1000 Linh Thạch giao cho Ngộ Tâm.",
    "任务内容：终于见到那人了，与他论道，胜利后可以救人，失":
      "Nội dung nhiệm vụ: Cuối cùng cũng gặp được người đó, luận đạo với y, chiến thắng có thể cứu người, thất",
    "败后被监禁，但可以尝试逃出，再救人。":
      "bại sẽ bị giam cầm, nhưng có thể thử trốn thoát rồi cứu người.",
    "任务地点：佛宗大雄宝殿悟芯":
      "Địa điểm nhiệm vụ: Ngộ Tâm ở Đại Hùng Bảo Điện Phật Tông,",
    "如何进行：与悟芯对话后进入那人房间":
      "Cách thực hiện: Nói chuyện với Ngộ Tâm rồi tiến vào phòng của người đó.",
    "提示：对方是炼虚境界，要进入剧情，最低化神境巅峰。": "Cảnh giới tối thiểu: Hóa Thần Đỉnh Phong.",
    "任务内容：战胜了，可以前往仓库救出被囚禁的众人，需":
      "Nội dung nhiệm vụ: Chiến thắng rồi, có thể đến nhà kho để giải cứu những người đang bị giam cầm, cần",
    "要注意，囚禁之有看守，建议最低等级化神巅峰。":
      "chú ý giam cầm có người canh giữ, đề nghị tu vi tối thiểu Hóa Thần Đỉnh Phong.",
    "任务地点：佛宗仓库": "Địa điểm nhiệm vụ: Kho Phật Tông.",
    "如何进行：进入仓库，用钥匙打开地下室门":
      "Cách thực hiện: Tiến vào kho, dùng chìa khóa mở cửa tầng hầm.",
    "报酬：100灵石 10声望": "Phần thưởng: 100 Linh Thạch, 10 Danh vọng.",
    "任务内容：战败了，被囚禁在深处，可以调查房间寻找":
      "Nội dung nhiệm vụ: Bị đánh bại và bị giam cầm ở nơi sâu nhất, có thể điều tra căn phòng để tìm",
    "逃脱的方法。注意要是逃跑失败达到3次会进入坏结局，":
      "cách trốn thoát. Lưu ý nếu đào tẩu thất bại quá 3 lần sẽ rơi vào kết cục xấu,",
    "逃跑需要战斗，注意血量药品。":
      "đào tẩu cần phải chiến đấu, chú ý lượng HP và dược phẩm.",
    "最低等级要求：化神巅峰":
      "Yêu cầu cảnh giới tối thiểu: Hóa Thần Đỉnh Phong",
    "任务地点：佛宗仓库地下室":
      "Địa điểm nhiệm vụ: Tầng hầm kho Phật Tông.",
    "如何进行：调查房间，打败看守。":
      "Cách thực hiện: Điều tra căn phòng, đánh bại lính canh.",
    "报酬：100灵石 5声望 ": "Phần thưởng: 100 Linh Thạch, 5 Danh Vọng.",
    "任务内容：终于成功逃出，救出众人再离开。":
      "Nội dung nhiệm vụ: Cuối cùng cũng trốn thoát thành công, cứu mọi người rồi rời đi.",
    "如何进行：打开牢门，对话所有囚禁者。":
      "Cách thực hiện: Mở cửa giam, đối thoại với tất cả người bị giam.",
    "报酬：100灵石 10声望 ": "Phần thưởng: 100 viên đá tinh thần 10 danh tiếng",
    "任务内容：为了不再有人被囚禁，再次前往战胜妖僧。":
      "Nội dung nhiệm vụ: Để không còn ai bị giam cầm nữa, hãy đi tiêu diệt yêu tăng thêm lần nữa.",
    "报酬：100灵石 100声望 1000功德":
      "Phần thưởng: 100 Linh Thạch, 100 Danh Vọng, 1000 Công Đức",
    "提示：失败会进入坏结局，请精神挑战。最低等级化神":
      "Gợi ý: Thất bại sẽ dẫn đến kết cục xấu, hãy cẩn thận khi khiêu chiến. Cảnh giới tối thiểu: Hóa Thần",
    "巅峰。": "Đỉnh Phong.",
    "任务内容：一切都结束了，和小和尚对话吧。":
      "Nội dung nhiệm vụ: Tất cả đã kết thúc, hãy nói chuyện với tiểu hòa thượng.",
    "任务地点：佛宗大雄宝殿小和尚":
      "Địa điểm nhiệm vụ: Tiểu hòa thượng ở Đại Hùng Bảo Điện Phật Tông,",
    "如何进行：与小和尚对话。": "Cách thực hiện: Nói chuyện với tiểu hòa thượng.",
    "报酬：4000灵石 10声望 20功德":
      "Phần thưởng: 4000 Linh Thạch, 10 Danh Vọng, 20 Công Đức",
    "青鸾": "Thanh Loan",
    "【灵宠任务】": "【Nhiệm vụ Linh Sủng】",
    "任务内容：琉璃村的少女听到后山有鸟鸣，可以确认大概率":
      "Nội dung nhiệm vụ: Thiếu nữ Lưu Ly Thôn nghe thấy tiếng chim hót ở hậu sơn, xác nhận khả năng cao",
    "是灵兽青鸾，作为新手宠物是最合适不过，前往琉璃村后山":
      "là linh sủng Thanh Loan, rất thích hợp cho người mới bắt đầu. Hãy đến hậu sơn Lưu Ly Thôn,",
    "山顶右边有一条绳子，触发任务后会有箭头显示，下去即可":
      "phía bên phải đỉnh núi có một sợi dây thừng, sau khi nhận nhiệm vụ sẽ có mũi tên chỉ dẫn, leo xuống đó",
    "进入青鸾巢穴。": "để tiến vào sào huyệt Thanh Loan.",
    "任务地点：琉璃岛琉璃村后山山顶右边绳子下青鸾巢穴":
      "Địa điểm nhiệm vụ: Sào huyệt Thanh Loan nằm dưới dây thừng bên phải đỉnh hậu sơn Lưu Ly Thôn, Lưu Ly Đảo.",
    "如何进行：进入后与青鸾战斗，战胜即可收服青鸾，不过，":
      "Cách thực hiện: Tiến vào và chiến đấu với Thanh Loan, chiến thắng sẽ thu phục được Thanh Loan. Tuy nhiên,",
    "对于新手来说，青鸾的战斗力不差，建议筑基后，装备升级":
      "đối với tân thủ, Thanh Loan có lực chiến không tồi, đề nghị sau khi đạt Trúc Cơ và nâng cấp trang bị",
    "满再来挑战。":
      "đầy đủ rồi mới tiến hành khiêu chiến.",
    "报酬：100灵石 2声望 1功德":
      "Phần thưởng: 100 viên Linh Thạch, 2 danh tiếng, 1 công đức",
    九尾狐: "Cửu Vĩ Hồ",
    "任务内容：流云城的男子发现流云城野外城门附近右边有一":
      "Nội dung nhiệm vụ: Nam tử ở Lưu Vân Thành phát hiện gần cổng ngoại thành phía bên phải",
    "只九尾狐出没，九尾狐法力不错，擅长群攻，作为宠物非常":
      "có một con Cửu Vĩ Hồ xuất hiện. Cửu Vĩ Hồ pháp lực cao cường, sở trường quần công, làm linh sủng rất",
    "不错，可以收服。": "tốt, có thể thu phục.",
    "任务地点：琉璃岛野外流云城城门口右边，战胜后获得九尾狐":
      "Địa điểm nhiệm vụ: Phía bên phải cổng thành Lưu Vân Thành trên Lưu Ly Đảo, chiến thắng nhận được Cửu Vĩ Hồ",
    "宠物。": "linh sủng.",
    青浮游: "Thanh Phù Du",
    "任务内容：在琉璃塔与少女对话后得知春天的时候，琉璃塔":
      "Nội dung nhiệm vụ: Đối thoại với thiếu nữ ở Lưu Ly Tháp biết được vào mùa xuân, bên ngoài",
    "外的小湖中心会出现青浮游这个宠物，到时候，战斗胜利可":
      "hồ nước nhỏ sẽ xuất hiện linh sủng Thanh Phù Du, khi đó chiến thắng chiến đấu có thể",
    "获得宠物青浮游，青浮游可以吃龙心进化成成年体。":
      "nhận được linh sủng Thanh Phù Du, Thanh Phù Du có thể ăn Long Tâm để tiến hóa thành thể trưởng thành.",
    "任务地点：琉璃塔中心小岛":
      "Địa điểm nhiệm vụ: Đảo nhỏ giữa hồ nước Lưu Ly Tháp.",
    "如何进行：龙心可以打青浮游获得，也可以望月阁购买。":
      "Cách thực hiện: Long Tâm có thể đánh bại Thanh Phù Du để thu thập, hoặc mua ở Vọng Nguyệt Các.",
    掏空城主老底: "Vét sạch kho khố Thành chủ",
    "【盗圣任务】": "【Nhiệm vụ Đạo Thánh】",
    "任务内容：深夜与盗圣在城主府碰头，然后进入城主府":
      "Nội dung nhiệm vụ: Đêm muộn gặp mặt Đạo Thánh tại Thành Chủ Phủ, sau đó tiến vào",
    "地下室，里面有怪物，请准备好在进入。":
      "hầm ngầm Thành Chủ Phủ, bên trong có quái vật, hãy chuẩn bị đầy đủ trước khi tiến vào.",
    "任务地点：流云城城主府夜晚":
      "Địa điểm nhiệm vụ: Thành Chủ Phủ Lưu Vân Thành vào ban đêm.",
    "如何进行：夜晚与城主府的盗圣对话":
      "Cách thực hiện: Ban đêm đối thoại với Đạo Thánh tại Thành Chủ Phủ.",
    "报酬：100灵石 1声望 ": "Phần thưởng: 100 Linh Thạch, 1 Danh Vọng",
    寻找丢失的钱包: "Tìm túi tiền bị mất",
    "【花家管家任务】": "【Nhiệm vụ Quản gia Hoa Gia】",
    "任务内容：流云城的元婴修士的管家，在采买的时候丢失":
      "Nội dung nhiệm vụ: Quản gia của một tu sĩ Nguyên Anh ở Lưu Vân Thành trong lúc mua sắm đã làm rơi",
    "了钱包，导致不敢回家，恳求好心人帮忙找回钱包，大概率":
      "mất túi tiền nên không dám về nhà, khẩn cầu người hảo tâm giúp đỡ tìm lại, khả năng cao",
    "在琉璃村丢失。": "bị rơi ở Lưu Ly Thôn.",
    "如何进行：进入琉璃村与田地附近的少妇对话":
      "Cách thực hiện: Vào Lưu Ly Thôn đối thoại với thiếu phụ gần ruộng đất.",
    "任务内容：获得情报，前往琉璃村村口右边空屋与小偷大战":
      "Nội dung nhiệm vụ: Thu thập tình báo, đến căn nhà hoang bên phải cổng Lưu Ly Thôn đại chiến với tên trộm",
    "一番，但是，仔细搜查，可以获得更多物品。":
      "một trận. Tuy nhiên, nếu lục soát kỹ lưỡng có thể nhận thêm vật phẩm.",
    "任务地点：琉璃村空屋": "Địa điểm nhiệm vụ: Căn nhà hoang ở Lưu Ly Thôn.",
    "如何进行：进入空屋": "Cách thực hiện: Tiến vào căn nhà hoang.",
    "任务内容：拿回钱包，回到流云城还给管家吧。":
      "Nội dung nhiệm vụ: Đoạt lại túi tiền, trở về Lưu Vân Thành trả lại cho quản gia.",
    "任务地点：流云城花家附近":
      "Địa điểm nhiệm vụ: Gần Hoa Phủ ở Lưu Vân Thành.",
    "如何进行：与花家附近的管家对话":
      "Cách thực hiện: Đối thoại với quản gia gần Hoa Phủ.",
    "任务内容：被管家诬赖，请进入花家进行辩解。":
      "Nội dung nhiệm vụ: Bị quản gia vu oan, hãy tiến vào Hoa Phủ để giải thích biện hộ.",
    "任务地点：流云城花家":
      "Địa điểm nhiệm vụ: Hoa Phủ ở Lưu Vân Thành.",
    "如何进行：进入花家": "Cách thực hiện: Tiến vào Hoa Phủ.",
    "任务内容：被花家元婴修士下了诅咒，每个月都会不自觉":
      "Nội dung nhiệm vụ: Bị tu sĩ Nguyên Anh của Hoa Gia hạ nguyền rủa, mỗi tháng đều sẽ tự động tìm",
    "的前往花家，被各种羞辱，要不怀孕，要不进入元婴期进行":
      "đến Hoa Gia và chịu đủ mọi sỉ nhục, trừ phi mang thai hoặc đạt tới Nguyên Anh Kỳ để",
    "反杀。": "tiến hành phản sát.",
    "如何进行：睡觉后，第二天就会自觉前往花家，除非进入":
      "Cách thực hiện: Sau khi ngủ, ngày hôm sau sẽ tự động đi đến Hoa Gia, trừ phi tiến vào",
    "主线剧情，不然会一直前往花家.":
      "cốt truyện chính, nếu không sẽ liên tục phải đi đến Hoa Gia.",
    帮忙做事: "Giúp đỡ làm việc",
    "内容：桃花村的洪珊珊需要人帮忙她做事情，就是做完":
      "Nội dung: Hồng San San ở Đào Hoa Thôn cần người giúp đỡ làm việc vặt,",
    "附近劈柴和洗衣服后，与洪珊珊对话。":
      "sau khi giúp chẻ củi và giặt quần áo phụ cận, hãy đối thoại với cô ấy.",
    "地点：桃花村左边的少女洪珊珊":
      "Địa điểm: Gặp thiếu nữ Hồng San San ở bên trái Đào Hoa Thôn.",
    "目标：做完洪珊珊的要求": "Mục tiêu: Hoàn thành yêu cầu của Hồng San San.",
    收集烤肉: "Thu thập thịt nướng",
    "内容：桃花村的杨淑华想要品尝琉璃岛郊外的狸力掉落的":
      "Nội dung: Dương Thục Hoa ở Đào Hoa Thôn muốn nếm thử món Thịt Nướng rơi ra từ Ly Lực ở ngoại ô Lưu Ly Đảo,",
    "烤肉，只要10份烤肉，她就能满足。":
      "chỉ cần thu thập đủ 10 phần Thịt Nướng là cô ấy sẽ thỏa mãn.",
    "地点：桃花村客栈门口杨淑华":
      "Địa điểm: Gặp Dương Thục Hoa ở trước cửa khách điếm Đào Hoa Thôn.",
    "目标：在琉璃岛郊外打狸力获得10份烤肉给桃花村的杨淑华":
      "Mục tiêu: Đánh bại Ly Lực ở ngoại ô Lưu Ly Đảo để kiếm 10 phần Thịt Nướng giao cho Dương Thục Hoa.",
    给土地的贡品: "Vật phẩm cúng tế Thổ Địa",
    "内容：桃花村的吴华华是一个对神明虔诚的人，想要1头猪，":
      "Nội dung: Ngô Hoa Hoa ở Đào Hoa Thôn là một tín đồ thành kính, muốn dâng 1 con heo,",
    "2只鸡，1坛女儿红作为贡品给桃花村的土地。":
      "2 con gà và 1 vò Nữ Nhi Hồng làm vật phẩm cúng tế cho Thổ Địa Đào Hoa Thôn.",
    "地点：桃花村道具店下的少妇吴华华":
      "Địa điểm: Thiếu phụ Ngô Hoa Hoa phía dưới tiệm đạo cụ Đào Hoa Thôn.",
    "目标：在皇城市集武器店旁边的小桥上可以购买到猪和鸡，":
      "Mục tiêu: Có thể mua heo và gà trên cây cầu nhỏ cạnh tiệm vũ khí ở chợ Hoàng Thành,",
    "酒在客栈有贩卖。": "còn rượu thì mua ở khách điếm.",
    寻找坠龙腾: "Tìm Trụy Long Đằng",
    "内容：桃花村的客栈小二皆大厨的张伍想要用坠龙腾来制作":
      "Nội dung: Trương Ngũ, tiểu nhị kiêm đầu bếp của khách điếm tại Đào Hoa Thôn, muốn sử dụng Trụy Long Đằng để chế biến",
    "料理，可是正好缺少10份坠龙腾，希望有人能给他。":
      "món ăn, nhưng lại đang thiếu mất 10 phần Trụy Long Đằng, hy vọng có người giao cho y.",
    "地点：桃花村客栈前台的男性张伍":
      "Địa điểm: Quầy lễ tân khách điếm Đào Hoa Thôn gặp Trương Ngũ.",
    "目标：前往流云城赌场购买坠龙腾":
      "Mục tiêu: Đến sòng bạc Lưu Vân Thành để mua Trụy Long Đằng.",
    寻找皇家礼仪册: "Tìm Sách Nghi Lễ Hoàng Gia",
    "内容：桃花村入口的居民房里面，有个叫杨文修的少年想要":
      "Nội dung: Trong nhà dân ở lối vào Đào Hoa Thôn, có thiếu niên tên Dương Văn Tu muốn có",
    "一本属于的自己的皇家礼仪册。": "một cuốn Sách Nghi Lễ Hoàng Gia của riêng mình.",
    "地点：桃花村入口右边的居民房":
      "Địa điểm: Ngôi nhà dân bên phải lối vào Đào Hoa Thôn.",
    "目标：前往皇城客栈附近桥上购买皇家礼仪册，然后回到":
      "Mục tiêu: Đến cầu gần khách điếm Hoàng Thành mua Sách Nghi Lễ Hoàng Gia, sau đó quay về",
    桃花村给杨文修: "Đào Hoa Thôn và đưa cho Dương Văn Tu.",
    小叶子的请求: "Yêu cầu của Tiểu Diệp Tử",
    "内容：前往凤朝皇城，贩卖牲畜的贩子似乎有卖牛奶。":
      "Nội dung: Đến Phượng Triều Hoàng Thành, tìm thương nhân bán gia súc hình như có bán sữa bò.",
    "地点：傲天门弟子房甲小叶子":
      "Địa điểm: Phòng đệ tử Giáp Ngạo Thiên Môn — Tiểu Diệp Tử.",
    "目标：皇城平民区入口处附近的摊贩购买牛奶":
      "Mục tiêu: Đến quầy bán hàng gần lối vào khu bình dân Hoàng Thành mua sữa bò,",
    "报酬：100灵石 1声望 1功德":
      "Phần thưởng: 100 viên Linh Thạch, 1 danh vọng, 1 công đức",
    "任务已完成，请交付给傲天门弟子房甲小叶子。":
      "Nhiệm vụ đã hoàn thành, hãy giao cho Tiểu Diệp Tử ở phòng đệ tử Giáp Ngạo Thiên Môn.",
    油吸膏手的请求: "Yêu cầu của Du Hấp Cao Thủ",
    "内容：油吸膏手的油吸鸡不见了，大概是在房间的某个":
      "Nội dung: Du Hấp Kê của Du Hấp Cao Thủ bị mất tích, có lẽ đang ở góc nào đó",
    "角落，找到它，并交给油吸膏手":
      "trong phòng, hãy tìm nó rồi giao cho Du Hấp Cao Thủ.",
    "地点：傲天门弟子房甲油吸膏手":
      "Địa điểm: Phòng đệ tử Giáp Ngạo Thiên Môn — Du Hấp Cao Thủ.",
    "目标：傲天门弟子房甲房间内的油吸鸡":
      "Mục tiêu: Du Hấp Kê trong phòng đệ tử Giáp Ngạo Thiên Môn.",
    "任务已完成，请交付给傲天门弟子房甲油吸膏手。":
      "Nhiệm vụ đã hoàn thành, hãy giao cho Du Hấp Cao Thủ ở phòng đệ tử Giáp Ngạo Thiên Môn.",
    莫邪的请求: "Yêu cầu của Mạc Tà",
    "内容：莫邪因为境界一直无法突破，需要丹药辅助，特此":
      "Nội dung: Mạc Tà do cảnh giới trì trệ không thể đột phá nên cần đan dược trợ giúp, đặc biệt",
    "委托\\n[1]炼制浑天丹，帮助他突破到元婴境界。":
      "ủy thác \\n[1] luyện chế Hỗn Thiên Đan để giúp y đột phá lên Nguyên Anh Cảnh.",
    "地点：傲天门弟子房甲油莫邪":
      "Địa điểm: Phòng đệ tử Giáp Ngạo Thiên Môn — Mạc Tà.",
    "目标：炼制浑天丹给莫邪。":
      "Mục tiêu: Luyện chế Hỗn Thiên Đan giao cho Mạc Tà.",
    "报酬：1000灵石 5声望 2功德":
      "Phần thưởng: 1000 viên Linh Thạch, 5 danh tiếng, 2 công đức",
    "任务已完成，请交付给傲天门弟子房甲莫邪。":
      "Nhiệm vụ đã hoàn thành, hãy giao cho Mạc Tà ở phòng đệ tử Giáp Ngạo Thiên Môn.",
    墨胎雲祁的请求: "Yêu cầu của Mặc Thai Vân Kỳ",
    "内容：墨胎雲祁想要制作可口的鲜花饼，请前往皇城找":
      "Nội dung: Mặc Thai Vân Kỳ muốn làm Bánh Hoa Tươi thơm ngon, hãy đến Hoàng Thành tìm",
    "卖花的小姑娘，购买可食用桃花、玫瑰花花瓣。":
      "cô bé bán hoa để mua cánh hoa đào và cánh hoa hồng ăn được.",
    "地点：傲天门长老房墨胎雲祁":
      "Địa điểm: Phòng trưởng lão Ngạo Thiên Môn — Mặc Thai Vân Kỳ.",
    "目标：购买3份可食用桃花花瓣 5份可食用玫瑰花花瓣":
      "Mục tiêu: Mua 3 phần cánh đào ăn được và 5 phần cánh hoa hồng ăn được,",
    交给长老房的长老墨胎雲祁:
      "Giao cho trưởng lão Mặc Thai Vân Kỳ ở phòng trưởng lão",
    "报酬：300灵石 2声望 1功德":
      "Phần thưởng: 300 viên Linh Thạch, 2 danh tiếng, 1 công đức",
    "任务已完成，请交付给傲天门长老房的长老墨胎雲祁。":
      "Nhiệm vụ đã hoàn thành, hãy giao cho trưởng lão Mặc Thai Vân Kỳ ở phòng trưởng lão Ngạo Thiên Môn.",
    望月阁的任务: "Nhiệm vụ Vọng Nguyệt Các",
    "【望月阁任务】": "【Nhiệm vụ Vọng Nguyệt Các】",
    "内容：为了开启元婴期及之后等级的的丹方和技能书，":
      "Nội dung: Để mở khóa đan phương và sách kỹ năng từ Nguyên Anh Kỳ trở lên,",
    "  需要30颗二阶妖兽妖丹": "cần 30 viên Nhị Giai Yêu Đan của yêu thú.",
    "地点：望月阁二楼": "Địa điểm: Tầng 2 Vọng Nguyệt Các.",
    "目标：购买或者打怪物收集二阶妖丹":
      "Mục tiêu: Mua hoặc đánh quái để thu thập Nhị Giai Yêu Đan.",
    "报酬：开启2阶段望月阁":
      "Phần thưởng: Mở khóa Vọng Nguyệt Các Giai Đoạn 2.",

    //QUESTS TASK
    "\\C[10]【剧情】主线提示：\\C[0]":
      "\\C[10]【Cốt Truyện】 Gợi ý chủ tuyến:\\C[0]",
    "任务内容：前往流云城城门口与师兄对话。":
      "Nội dung nhiệm vụ: Đến cổng Lưu Vân Thành đối thoại với Sư huynh.",
    "任务地点：\\C[6]流云城在流离岛野外左上角\\C[0]":
      "Địa điểm nhiệm vụ: \\C[6]Lưu Vân Thành ở góc trên bên trái dã ngoại Lưu Ly Đảo.\\C[0]",
    "如何进行：和师兄对话": "Cách thực hiện: Đối thoại với Sư huynh.",
    "——————————————————————————————————————":
      "——————————————————————————————————————",
    "任务奖励：金乌丹  \\C[2]2\\C[0]颗  灵石  \\C[2]50\\C[0]":
      "Phần thưởng nhiệm vụ: Kim Ô Đan \\C[2]2\\C[0] viên, Linh Thạch \\C[2]50\\C[0]",
    "": "",
    "任务内容：进入流云城，可以找引导（新手推荐）":
      "Nội dung nhiệm vụ: Tiến vào Lưu Vân Thành, có thể tìm người chỉ dẫn (khuyên dùng cho tân thủ)",
    "          或四处走动。": "hoặc tự đi dạo xung quanh.",
    "（\\C[6]进入云梦阁休息则进下一个剧情。\\C[0]）":
      "(\\C[6]Tiến vào Vân Mộng Các nghỉ ngơi sẽ tiến vào cốt truyện tiếp theo.\\C[0])",
    "任务地点：流云城内": "Địa điểm nhiệm vụ: Trong thành Lưu Vân.",
    "如何进行：进入流云城": "Cách thực hiện: Tiến vào Lưu Vân Thành.",
    "任务奖励：灵石   \\C[2]100\\C[0]":
      "Phần thưởng nhiệm vụ: Linh Thạch \\C[2]100\\C[0]",
    "\\C[10]【炼丹】主线提示：\\C[0]":
      "\\C[10]【Luyện Đan】 Gợi ý chủ tuyến:\\C[0]",
    "任务内容：点击\\C[6]炼丹炉\\C[0]，炼制\\C[6]筑基丹\\C[0]。":
      "Nội dung nhiệm vụ: Nhấp vào \\C[6]Luyện Đan Lư\\C[0], luyện chế \\C[6]Trúc Cơ Đan\\C[0].",
    "任务地点：流云城天之阁":
      "Địa điểm nhiệm vụ: Thiên Chi Các Lưu Vân Thành.",
    "如何进行：点击屋内炼丹炉":
      "Cách thực hiện: Nhấp vào Luyện Đan Lư trong phòng.",
    "任务奖励：灵石   \\C[2]50\\C[0] ":
      "Phần thưởng nhiệm vụ: Linh Thạch \\C[2]50\\C[0]",
    "任务内容：先突破境界，普通突破去药店购买\\C[6]筑基丹\\C[0],":
      "Nội dung nhiệm vụ: Cần đột phá cảnh giới trước, đột phá thông thường hãy đến tiệm thuốc mua \\C[6]Trúc Cơ Đan\\C[0],",
    "突破后才可以进入下一段剧情。":
      "đột phá xong mới có thể tiến vào cốt truyện tiếp theo.",
    "任务地点：流云城": "Địa điểm nhiệm vụ: Lưu Vân Thành.",
    "如何进行：\\C[6]按R键可以开启寻路功能，点击善德堂药店后买":
      "Cách thực hiện: \\C[6]Nhấn phím R để bật chức năng tự động tìm đường. Nhấp chọn tiệm thuốc Thiện Đức Đường để mua",
    "丹药。\\C[0]": "đan dược.\\C[0]",
    "任务内容：听说有\\C[6]流离岛野外\\C[0]出没新的秘境。":
      "Nội dung nhiệm vụ: Nghe nói dã ngoại \\C[6]Lưu Ly Đảo\\C[0] xuất hiện bí cảnh mới.",
    "任务地点：流云城野外": "Địa điểm nhiệm vụ: Ngoại ô Lưu Vân Thành.",
    "如何进行：\\C[6]出流云城\\C[0]去看看。\\C[0]":
      "Cách thực hiện: \\C[6]Ra khỏi Lưu Vân Thành\\C[0] để xem thử.\\C[0]",
    "任务内容：进入琉璃岛野外的秘境进行后续剧情。":
      "Nội dung nhiệm vụ: Tiến vào bí cảnh dã ngoại Lưu Ly Đảo để tiếp tục cốt truyện.",
    "任务地点：流云城野外秘境一层":
      "Địa điểm nhiệm vụ: Tầng 1 dã ngoại bí cảnh Lưu Vân Thành.",
    "如何进行：进入秘境": "Cách thực hiện: Tiến vào bí cảnh.",
    "任务奖励：金乌丹 \\C[2]3\\C[0]颗  紫飒露 \\C[2]3\\C[0]颗  灵石  \\C[2]100\\C[0]":
      "Phần thưởng nhiệm vụ: Kim Ô Đan \\C[2]3\\C[0] viên, Tử Sa Lộ \\C[2]3\\C[0] chai, Linh Thạch \\C[2]100\\C[0]",
    "任务内容：经过刚刚事件，请继续探索秘境触发后续剧情。":
      "Nội dung nhiệm vụ: Sau sự việc vừa rồi, hãy tiếp tục khám phá bí cảnh để kích hoạt cốt truyện tiếp theo.",
    "（\\C[6]和秘境里的修士发生冲突，获得的利益更大。\\C[0]）":
      "(\\C[6]Xung đột với tu sĩ trong bí cảnh sẽ thu hoạch được lợi ích lớn hơn.\\C[0])",
    "任务地点：流云城野外秘境第二层":
      "Địa điểm nhiệm vụ: Tầng 2 dã ngoại bí cảnh Lưu Vân Thành.",
    "如何进行：继续前进": "Cách thực hiện: Tiếp tục tiến lên.",
    "任务内容：先回城购买，\\C[2]破空戒指\\C[0]，再继续探索秘境。":
      "Nội dung nhiệm vụ: Hãy trở lại thành phố mua \\C[2]Phá Không Giới Chỉ\\C[0], rồi tiếp tục khám phá bí cảnh.",
    "任务地点：流云城金银坊":
      "Địa điểm nhiệm vụ: Kim Ngân Phường Lưu Vân Thành.",
    "如何进行：进入金银坊兑换40灵玛在对兑换道具":
      "Cách thực hiện: Vào Kim Ngân Phường đổi lấy 40 Linh Mã rồi đổi đạo cụ.",
    "任务内容：进入秘境最深处，触发后续剧情。":
      "Nội dung nhiệm vụ: Tiến vào nơi sâu nhất của bí cảnh để kích hoạt cốt truyện tiếp theo.",
    "任务地点：流云城野外秘境第四层":
      "Địa điểm nhiệm vụ: Tầng 4 dã ngoại bí cảnh Lưu Vân Thành.",
    "如何进行：深入秘境":
      "Cách thực hiện: Đi sâu vào bí cảnh.",
    "任务内容：被黑蛟控制住了，只能按照黑蛟的要求来选择。":
      "Nội dung nhiệm vụ: Bị Hắc Giao khống chế, chỉ có thể lựa chọn theo yêu cầu của Hắc Giao.",
    "（\\C[6]和师兄杜云做还是和陌生人做？\\C[0]）":
      "(\\C[6]Song tu với sư huynh Đỗ Vân hay với người lạ?\\C[0])",
    "任务内容：黑蛟加入，可前往凤朝皇都调查灵兽。":
      "Nội dung nhiệm vụ: Hắc Giao gia nhập, có thể tiến đến Phượng Triều Hoàng Đô điều tra linh thú.",
    "（\\C[2]前往凤朝皇城\\C[0]）":
      "(\\C[2]Tiến đến Phượng Triều Hoàng Thành\\C[0])",
    "任务地点：凤朝皇城": "Địa điểm nhiệm vụ: Phượng Triều Hoàng Thành.",
    "如何进行：进入大地图飞行寻路到皇朝":
      "Cách thực hiện: Mở đại bản đồ bay tìm đường đến Hoàng triều.",
    "任务达成奖励：灵石   \\C[2]100\\C[0]":
      "Phần thưởng hoàn thành nhiệm vụ: Linh Thạch \\C[2]100\\C[0]",
    "任务内容：黑蛟和阿欢似乎发现了什么，前往并和阿欢对话。":
      "Nội dung nhiệm vụ: Hắc Giao và A Hoan dường như đã phát hiện điều gì đó, hãy đến đối thoại với A Hoan.",
    "任务地点：凤朝皇城雕像下面":
      "Địa điểm nhiệm vụ: Dưới chân tượng thần Phượng Triều Hoàng Thành.",
    "如何进行：到了雕像下和阿欢对话":
      "Cách thực hiện: Đến dưới chân tượng thần đối thoại với A Hoan.",
    "任务内容：想要打听什么消息，只要去本地的客栈就可以。":
      "Nội dung nhiệm vụ: Nếu muốn dò hỏi tin tức, chỉ cần đến khách điếm địa phương.",
    "（\\C[2]前往皇城（凤来楼）客栈打听消息。\\C[0]）":
      "(\\C[2]Đến khách điếm Hoàng Thành (Phượng Lai Lâu) dò hỏi tin tức.\\C[0])",
    "任务地点：凤朝皇城凤来楼客栈":
      "Địa điểm nhiệm vụ: Khách điếm Phượng Lai Lâu Phượng Triều Hoàng Thành.",
    "如何进行：进入客栈": "Cách thực hiện: Tiến vào khách điếm.",
    "任务内容：心情复杂，先冷静一下，和阿欢一起回家吧。":
      "Nội dung nhiệm vụ: Tâm trạng phức tạp, trước tiên hãy bình tĩnh lại, cùng A Hoan về nhà thôi.",
    "（\\C[6]前往皇城大门口与阿欢对话.\\C[0]）":
      "(\\C[6]Đến cổng Hoàng Thành đối thoại với A Hoan.\\C[0])",
    "任务地点：凤朝皇城门口": "Địa điểm nhiệm vụ: Cổng Phượng Triều Hoàng Thành.",
    "如何进行：门口和阿欢对话": "Cách thực hiện: Đối thoại với A Hoan ở cổng thành.",
    "任务内容：到房子庭院右边池塘最右边找到墨轩对话。":
      "Nội dung nhiệm vụ: Đến khu vực bên phải hồ nước ở góc phải sân viện tìm Mặc Hiên đối thoại.",
    "（\\C[6]重要提示：这次对话会影响后续剧情发展，请提前存档。\\C[0]）":
      "(\\C[6]Lưu ý quan trọng: Cuộc đối thoại này sẽ ảnh hưởng đến cốt truyện tiếp theo, hãy lưu trữ trước.\\C[0])",
    "任务地点：仙灵苑": "Địa điểm nhiệm vụ: Tiên Linh Uyển.",
    "如何进行：仙灵苑右边水池上和墨轩对话":
      "Cách thực hiện: Đối thoại với Mặc Hiên trên hồ nước bên phải Tiên Linh Uyển.",
    "任务内容：为了调查靖王和王思谋的线索，派阿欢前往\\C[6]皇城平民区。\\C[0]":
      "Nội dung nhiệm vụ: Để điều tra manh mối về Kính Vương và Vương Tư Mưu, cử A Hoan đến \\C[6]khu bình dân Hoàng Thành.\\C[0]",
    "\\n[1]则前往\\C[6]妓院\\C[0]打听。":
      "\\n[1] thì đi đến \\C[6]kỹ viện\\C[0] dò hỏi.",
    "如何进行：进入皇城": "Cách thực hiện: Tiến vào Hoàng Thành.",
    "任务奖励：银两   \\C[2]5000\\C[0]":
      "Phần thưởng nhiệm vụ: Bạc \\C[2]5000\\C[0] lượng",
    "任务内容：前往贫民区和混混对话，企图让混混带去妓院。":
      "Nội dung nhiệm vụ: Đến khu bần dân đối thoại với du côn, tìm cách bắt bọn chúng dẫn tới kỹ viện.",
    "任务地点：贫民区混混": "Địa điểm nhiệm vụ: Du côn khu bần dân.",
    "如何进行：先去和左边的NPC对话，再和混混对话":
      "Cách thực hiện: Trước tiên đến đối thoại với NPC bên trái, sau đó đối thoại với du côn.",
    "任务内容：进入贫民区左边的空房间里休息。":
      "Nội dung nhiệm vụ: Tiến vào phòng trống bên trái khu bần dân nghỉ ngơi.",
    "任务地点：贫民区左边空房间":
      "Địa điểm nhiệm vụ: Phòng trống bên trái khu bần dân.",
    "任务内容：为了稳住老鸨，先赚够500两。":
      "Nội dung nhiệm vụ: Để ổn định lòng tin của tú bà, trước tiên cần kiếm đủ 500 lượng bạc.",
    "任务地点：妓院": "Địa điểm nhiệm vụ: Kỹ viện.",
    "如何进行：先和NPC对话，接客，休息。":
      "Cách thực hiện: Đầu tiên đối thoại với NPC, tiếp khách rồi nghỉ ngơi.",
    "任务内容：先悄悄离开妓院，再回来，继续调查。":
      "Nội dung nhiệm vụ: Trước tiên lặng lẽ rời khỏi kỹ viện, sau đó quay lại tiếp tục điều tra.",
    "任务地点：醉仙局门口":
      "Địa điểm nhiệm vụ: Cổng Túy Tiên Cư.",
    "如何进行：到醉仙局门口出去":
      "Cách thực hiện: Đi ra ngoài cổng Túy Tiên Cư.",
    "任务内容：继续在醉仙居打工，尝试接近头牌，并获得头牌":
      "Nội dung nhiệm vụ: Tiếp tục làm việc ở Túy Tiên Cư, tìm cách tiếp cận danh kỹ đầu bài và giành được",
    "好感。": "thiện cảm từ nàng.",
    "任务地点：醉仙局花月阁":
      "Địa điểm nhiệm vụ: Hoa Nguyệt Các Túy Tiên Cư.",
    "如何进行：再花月阁进接客，声望到达一定阶段，对应的剧":
      "Cách thực hiện: Tiếp khách tại Hoa Nguyệt Các, khi danh vọng đạt mức độ nhất định, cốt truyện",
    "情也触发。": "tương ứng sẽ được kích hoạt.",
    "任务内容：为了调查靖王和王思谋的线索，派阿欢前往\\C[6]皇城妓院。\\C[0]":
      "Nội dung nhiệm vụ: Để điều tra manh mối về Kính Vương và Vương Tư Mưu, cử A Hoan đến \\C[6]kỹ viện Hoàng Thành.\\C[0]",
    "\\n[1]则前往\\C[6]皇城平民区\\C[0]打听。":
      "\\n[1] thì đi đến \\C[6]khu bình dân Hoàng Thành\\C[0] dò hỏi.",
    "任务地点：皇城平民区": "Địa điểm nhiệm vụ: Khu bình dân Hoàng Thành.",
    "如何进行：去平民区深处与NP对话":
      "Cách thực hiện: Đi sâu vào khu bình dân đối thoại với NPC.",
    "————————————————————————————————————————————————":
      "————————————————————————————————————————————————",
    "任务内容：为了方便之后接近或者混入靖王府，得帮助在靖王府":
      "Nội dung nhiệm vụ: Để thuận tiện tiếp cận hoặc lẩn vào Kính Vương Phủ sau này, phải trợ giúp người thân",
    "          打工的馨月亲戚，获得信任后，方便潜入靖王府。":
      "          của Hinh Nguyệt đang làm việc tại Kính Vương Phủ, sau khi có được sự tin tưởng sẽ dễ dàng lẻn vào.",
    "如何进行：去平民区深处与NPC对话":
      "Cách thực hiện: Đi sâu vào khu vực dân sự và nói chuyện với NPC",
    "任务内容：帮助馨月亲戚解决混混的骚扰":
      "Nội dung nhiệm vụ: Giúp đỡ người thân Hinh Nguyệt giải quyết sự quấy nhiễu từ du côn.",
    "任务地点：皇城贫民区": "Địa điểm nhiệm vụ: khu ổ chuột của thành phố hoàng gia",
    "如何进行：去贫民区对话混混。":
      "Cách thực hiện: Đến khu bần dân đối thoại với du côn.",
    "任务内容：打败混混头目": "Nội dung nhiệm vụ: Đánh bại thủ lĩnh du côn.",
    "如何进行：进入混混房子一路打到底。":
      "Cách thực hiện: Tiến vào căn cứ du côn chiến đấu tới cùng.",
    "任务内容：和馨月亲戚对话": "Nội dung nhiệm vụ: Đối thoại với người thân của Hinh Nguyệt.",
    "如何进行：回到平民区和馨月亲戚对话。":
      "Cách thực hiện: Trở về khu bình dân đối thoại với người thân Hinh Nguyệt.",
    "任务内容：镇压乞丐": "Nội dung nhiệm vụ: Trấn áp ăn xin.",
    "如何进行：去平民区门口的乞丐屋里，看看 họ đang làm gì.":
      "Cách thực hiện: Đến nhà ăn xin ở cổng khu bình dân để xem bọn chúng đang làm gì.",
    "任务内容：再和馨月亲戚对话":
      "Nội dung nhiệm vụ: Đối thoại lại với người thân của Hinh Nguyệt,",
    "如何进行：去平民区和馨月亲戚对话。":
      "Cách thực hiện: Đến khu bình dân đối thoại với người thân Hinh Nguyệt.",
    "任务内容：一切到一个段落，回洞府，询问阿欢的调查结果。\\C[0]":
      "Nội dung nhiệm vụ: Mọi chuyện tạm thời xong xuôi, hãy quay về động phủ hỏi A Hoan kết quả điều tra.\\C[0]",
    "（\\C[6]询问完后会进入下一个剧情，有事处理，请回洞府前存档。\\C[0]）":
      "(\\C[6]Sau khi hỏi xong sẽ tiến vào tình tiết cốt truyện tiếp theo, có sự kiện cần xử lý, xin hãy lưu trữ trước khi về động phủ.\\C[0])",
    "如何进行：仙灵苑庭院右边":
      "Cách thực hiện: Khu vực bên phải sân viện Tiên Linh Uyển.",
    "任务奖励：灵石   \\C[2]200\\C[0]":
      "Phần thưởng nhiệm vụ: đá tinh thần\\C[2]200\\C[0]",
    "任务内容：知道了王思谋下落，前往桃花村，与村长对话。":
      "Nội dung nhiệm vụ: Biết được hành tung của Vương Tư Mưu, hãy đến Đào Hoa Thôn đối thoại với Trưởng thôn,",
    "          调查对话，深度挖掘桃花村的秘密。":
      "          điều tra đối thoại, đào sâu bí mật của Đào Hoa Thôn.",
    "任务地点：桃花村": "Địa điểm nhiệm vụ: Làng Hoa Đào",
    "如何进行：先和桃花村村长对话":
      "Cách thực hiện: Trước tiên đối thoại với Trưởng thôn Đào Hoa Thôn.",
    "任务奖励：灵石 \\C[2]100\\C[0]":
      "Phần thưởng nhiệm vụ: đá tinh thần\\C[2]100\\C[0]",
    "任务内容：桃花村村长想要考验\\n[1]能力，寻找需要帮助的人吧。":
      "Nội dung nhiệm vụ: Trưởng thôn Đào Hoa Thôn muốn khảo nghiệm năng lực của \\n[1], hãy tìm kiếm những người cần giúp đỡ.",
    "如何进行：桃花村头上有感叹号的村民（5人）":
      "Cách thực hiện: Dân làng có dấu chấm than trên đầu ở Đào Hoa Thôn (5 người).",
    "任务奖励：灵石 \\C[2]200\\C[0]":
      "Phần thưởng nhiệm vụ: đá tinh thần\\C[2]200\\C[0]",
    "提示：客栈药材在流云城赌场 皇家礼仪在皇城 鸡 猪 香在皇城":
      "Gợi ý: Dược liệu khách điếm mua tại sòng bạc Lưu Vân Thành, Sách Nghi Lễ Hoàng Gia mua tại Hoàng Thành, heo, gà, nhang mua tại Hoàng Thành,",
    "      烤肉打琉璃岛狸力 任务NPC可能在屋子里请四处探索":
      "      Thịt Nướng săn từ Ly Lực Lưu Ly Đảo. NPC nhiệm vụ có thể ở trong nhà, hãy thăm dò xung quanh.",
    "任务内容：桃花村村长左右言他，不如私下接触村民。也许有意想不到的收获。\\C[0]":
      "Nội dung nhiệm vụ: Trưởng thôn Đào Hoa Thôn nói quanh co lấp liếm, chi bằng hãy lén tiếp xúc riêng với thôn dân. Có lẽ sẽ có thu hoạch ngoài ý muốn.\\C[0]",
    "（\\C[6]请尝试和屋内屋外的村民都对话一下。\\C[0]）":
      "(\\C[6]Hãy thử đối thoại với tất cả thôn dân ở trong nhà và ngoài sân.\\C[0])",
    "任务地点：桃花村村长屋子右边":
      "Địa điểm nhiệm vụ: Phía bên phải nhà Trưởng thôn ở Đào Hoa Thôn.",
    "如何进行：前往对话": "Cách thực hiện: Đến tiến hành đối thoại.",
    "任务内容：知道王思谋大概下落，但要进入虫穴，必须让":
      "Nội dung nhiệm vụ: Biết được hành tung đại khái của Vương Tư Mưu, nhưng muốn tiến vào Trùng Huyệt, phải có",
    "          朱晓华帮助。\\C[0]": "          sự trợ giúp của Chu Tiểu Hoa.\\C[0]",
    "   （\\C[6]在先和朱晓华对话，完成朱晓华的要求，朱晓     ":
      "(\\C[6]Hãy đối thoại với Chu Tiểu Hoa trước, hoàn thành yêu cầu của cô ấy, khi đó Chu Tiểu",
    "     \\C[6]华就可以带你进去。\\C[0]）":
      "     \\C[6]Hoa mới có thể dẫn bạn vào.\\C[0])",
    "任务地点：桃花村中央": "Địa điểm nhiệm vụ: Trung tâm Đào Hoa Thôn.",
    "如何进行：准备2000灵石后和朱晓华对话。":
      "Cách thực hiện: Chuẩn bị sẵn 2000 Linh Thạch rồi đối thoại với Chu Tiểu Hoa.",
    "任务内容：离开桃花村，到皇城平民区，和馨月亲戚对话，前往靖王府。\\C[0]":
      "Nội dung nhiệm vụ: Rời khỏi Đào Hoa Thôn, đến khu bình dân Hoàng Thành, đối thoại với người thân Hinh Nguyệt để tiến vào Kính Vương Phủ.\\C[0]",
    "（\\C[6]馨月亲戚在平民区最里面。\\C[0]））":
      "(\\C[6]Người thân của Hinh Nguyệt ở sâu nhất trong khu bình dân.\\C[0]))",
    "任务地点：皇都平民区":
      "Địa điểm nhiệm vụ: Khu bình dân Hoàng Thành.",
    "如何进行：进入平民区和馨月亲戚对话":
      "Cách thực hiện: Tiến vào khu bình dân đối thoại với người thân Hinh Nguyệt.",
    "任务奖励：灵石 \\C[2]200\\C[0] ":
      "Phần thưởng nhiệm vụ: đá tinh thần\\C[2]200\\C[0]",
    "任务内容：为了前往凤临阁，必须获得金湾印章，应该是在书房里。\\C[0]":
      "Nội dung nhiệm vụ: Để có thể đến Phượng Lâm Các, bắt buộc phải có được Kim Oản Ấn Chương, có lẽ là đang ở trong thư phòng.\\C[0]",
    "（\\C[6]获得靖王府众人的信任，然后没人的时候，就可以调查书房。\\C[0]）":
      "(\\C[6]Có được sự tin tưởng của mọi người trong Kính Vương Phủ, sau đó lợi dụng lúc vắng người để lục soát thư phòng.\\C[0])",
    "任务地点：靖王府": "Địa điểm nhiệm vụ: Tĩnh Vương Phủ.",
    "如何进行：在靖王府打工，让众人降低警惕，偷取印章。":
      "Cách thực hiện: Làm công việc vặt ở Kính Vương Phủ để mọi người buông lỏng cảnh giác rồi trộm lấy ấn chương.",
    "任务内容：前往\\C[2]军妓馆\\C[0]，救回母亲。\\C[0]":
      "Nội dung nhiệm vụ: Đến \\C[2]Quân Kỹ Quán\\C[0] để giải cứu mẫu thân.\\C[0]",
    "（\\C[6]军妓馆在大地图的西北方向。\\C[0]）":
      "(\\C[6]Quân Kỹ Quán nằm ở hướng Tây Bắc trên đại bản đồ.\\C[0])",
    "任务地点：军妓馆": "Địa điểm nhiệm vụ: Quân Kỹ Quán.",
    "如何进行：前往大地图，寻路。":
      "Cách thực hiện: Lên đại bản đồ để tự động tìm đường.",
    "任务内容：前往\\C[2]西北军营\\C[0]，结束他们的罪恶。":
      "Nội dung nhiệm vụ: Đến \\C[2]Tây Bắc Quân Doanh\\C[0], chấm dứt tội ác của chúng.",
    "（\\C[6]西北军营在军妓馆的上面\\C[0]）":
      "(\\C[6]Tây Bắc Quân Doanh nằm ở phía trên Quân Kỹ Quán.\\C[0])",
    "任务地点：西北军营": "Địa điểm nhiệm vụ: Tây Bắc Quân Doanh.",
    "任务内容：前往\\C[6]凤临阁\\C[0]打探朱雀的真正实力。":
      "Nội dung nhiệm vụ: Đến \\C[6]Phượng Lâm Các\\C[0] để dò la thực lực chân chính của Chu Tước.",
    "任务地点：凤临阁": "Địa điểm nhiệm vụ: Phượng Lâm Các.",
    "任务内容：调查王府，寻找一些蛛丝马迹。":
      "Nội dung nhiệm vụ: Lục soát Vương phủ để tìm kiếm một số manh mối.",
    "（\\C[6]重点在书房里\\C[0]）":
      "(\\C[6]Manh mối chủ chốt nằm ở thư phòng.\\C[0])",
    "任务地点：皇城靖王府":
      "Địa điểm nhiệm vụ: Hoàng Thành Kính Vương Phủ.",
    "如何进行：前往大地图皇城，贵族区，靖王府":
      "Cách thực hiện: Đi đến Hoàng Thành trên đại bản đồ, tìm tới khu quý tộc để vào Kính Vương Phủ.",
    "任务内容：准备一下后，前往魔界。":
      "Nội dung nhiệm vụ: Chuẩn bị sẵn sàng rồi tiến về Ma Giới.",
    "任务地点：魔界": "Địa điểm nhiệm vụ: Ma Giới.",
    "如何进行：前往大地图，寻路":
      "Cách thực hiện: Lên đại bản đồ để tự động tìm đường.",
    "任务内容：准备一下后，前往江南。":
      "Nội dung nhiệm vụ: Chuẩn bị sẵn sàng rồi đi Giang Nam.",
    "任务地点：江南": "Địa điểm nhiệm vụ: Giang Nam.",
    "任务内容：前往天元境前面，去看这一切的真相吧。":
      "Nội dung nhiệm vụ: Hãy đến trước Thiên Nguyên Cảnh để chứng kiến chân tướng của tất cả chuyện này.",
    "如何进行：和魔尊对话到达天元境之前，然后点击天":
      "Cách thực hiện: Đối thoại với Ma Tôn để đi đến trước Thiên Nguyên Cảnh, sau đó nhấp chọn Thiên",
    "元镜。": "Nguyên Kính.",
    "任务内容：跟随宇文玉赈灾，考查他的能力。":
      "Nội dung nhiệm vụ: Đi theo Vũ Văn Ngọc cứu tế tai ương, khảo nghiệm năng lực của y.",
    "任务内容：大地图前往不周山，获得姜子牙的打神鞭。":
      "Nội dung nhiệm vụ: Lên đại bản đồ đi đến Bất Chu Sơn để nhận Đả Thần Tiên của Khương Tử Nha.",
    "任务地点：不周山": "Địa điểm nhiệm vụ: Bất Chu Sơn.",
    "任务内容：前往皇城，进入皇宫，杀了宇文卿。":
      "Nội dung nhiệm vụ: Đi đến hoàng thành, vào cung điện và giết Yu Wenqing.",
    "任务地点：凤凰贵族区深处的皇宫":
      "Địa điểm nhiệm vụ: Hoàng cung sâu trong khu quý tộc Phượng Hoàng",
    "任务内容：再次前往凤临阁，杀了朱雀，消除心魔。":
      "Nội dung nhiệm vụ: Lại đến Phượng Lâm Các, giết chết Chu Tước, tiêu trừ tâm ma.",
    "\\C[10]【入魔】主线提示：\\C[0]":
      "\\C[10]【Đọa Ma】Gợi ý tuyến chính:\\C[0]",
    "任务内容：天道不公，入魔弑天，加入合欢宗或者血神":
      "Nội dung nhiệm vụ: Thiên đạo bất công, đọa ma sát thiên, gia nhập Hợp Hoan Tông hoặc Huyết Thần",
    "阁，然后可以杀任何人，获得血煞之气，在家里打坐可":
      "Các, sau đó có thể sát hại bất kỳ ai để thu thập Huyết Sát Chi Khí. Ở nhà tọa thiền có",
    "以转换血煞之气，增加属性。":
      "thể chuyển hóa Huyết Sát Chi Khí để gia tăng thuộc tính.",
    "任务地点：合欢宗、血神阁":
      "Địa điểm nhiệm vụ: Hợp Hoan Tông, Huyết Thần Các",
    "任务内容：开启天元境看到事情的真相，需要一些材料。":
      "Nội dung nhiệm vụ: Mở ra Thiên Nguyên Kính để chứng kiến chân tướng sự việc, cần một số nguyên liệu.",
    "功德50点，功德碎片30份，造化金莲10朵。":
      "50 điểm Công Đức, 30 Mảnh Vỡ Công Đức và 10 đóa Tạo Hóa Kim Liên.",
    "如何进行：前往佛宗获得功德，功德碎片和造化金莲需":
      "Cách thực hiện: Đến Phật Tông tích lũy Công Đức. Mảnh Vỡ Công Đức và Tạo Hóa Kim Liên thì",
    "要去魔界魔衣堂和黑武殿购买，当然也可以去拍卖会有":
      "phải đến Ma Y Đường và Hắc Võ Điện ở Ma Giới để mua, tất nhiên cũng có thể tham gia đấu giá,",
    "概率低价获得功德碎片。":
      "có tỷ lệ nhỏ mua được Mảnh Vỡ Công Đức với giá thấp.",
    "任务奖励：灵石 \\C[2]2000\\C[0]":
      "Phần thưởng nhiệm vụ: Linh Thạch \\C[2]2000\\C[0]",
    "任务内容：前往琉璃岛，血洗吧，让他们都成你的前进的":
      "Nội dung nhiệm vụ: Đến Lưu Ly Đảo, tiến hành huyết tẩy, khiến tất cả bọn họ trở thành",
    "血食。": "huyết thực để ngươi tiến bước.",
    "任务地点：琉璃岛流云城和琉璃村全部NPC":
      "Địa điểm nhiệm vụ: Toàn bộ NPC tại Lưu Vân Thành và Lưu Ly Thôn trên Lưu Ly Đảo",
    "任务奖励：灵石 \\C[2]500\\C[0] 1000血煞值":
      "Phần thưởng nhiệm vụ: Linh Thạch \\C[2]500\\C[0] 1000 Huyết Sát Trị",
    "任务内容：既然被追杀，那就要更加强大，去鬼蜮寻找":
      "Nội dung nhiệm vụ: Đã bị truy sát thì phải trở nên mạnh mẽ hơn, hãy đi tìm",
    "万魂幡吧，只有它最配你。":
      "Vạn Hồn Phan, chỉ có nó mới xứng với ngươi.",
    "任务地点：鬼蜮": "Địa điểm nhiệm vụ: Quỷ Vực.",
    "任务奖励：灵石 \\C[2]500\\C[0] 500血煞值":
      "Phần thưởng nhiệm vụ: Linh Thạch \\C[2]500\\C[0] 500 Huyết Sát Trị",
    "任务内容：为了能上上界杀天尊，前往魔界，与能去上":
      "Nội dung nhiệm vụ: Để có thể tiến lên Thượng Giới sát Thiên Tôn, hãy đến Ma Giới, đàm phán",
    "界的魔尊谈判。": "với Ma Tôn - người có cách lên Thượng Giới.",
    "任务内容：打败魔尊，获得前往上界的方法。":
      "Nội dung nhiệm vụ: Đánh bại Ma Tôn, nhận lấy phương pháp tiến lên Thượng Giới.",
    "任务内容：前往不周山最深处，可以前往上界，杀了天尊":
      "Nội dung nhiệm vụ: Tiến vào nơi sâu nhất Bất Chu Sơn để đi lên Thượng Giới, tiêu diệt Thiên Tôn,",
    "这样就可以获得统治下界的权柄，让那些伤害\\n[1]的人，":
      "như vậy sẽ đoạt được quyền thống trị Hạ Giới, khiến những kẻ đã tổn hại đến \\n[1]",
    "都瑟瑟发抖吧！！！": "đều phải run rẩy khiếp sợ!!!",
    "任务地点：不周山，天界。": "Địa điểm nhiệm vụ: Bất Chu Sơn, Thiên Giới.",
    "获得奖励：下界统治权柄":
      "Phần thưởng nhận được: Quyền thống trị Hạ Giới",
    "任务内容：请前往聚灵阵，点击开启后，选择突破境界。":
      "Nội dung nhiệm vụ: Mời các ngươi đi tới Tụ Linh Trận, bấm vào để mở ra, lựa chọn đột phá cảnh giới.",
    "如何进行：点击屋内聚灵阵":
      "Cách thực hiện: Nhấp vào Tụ Linh Trận trong phòng.",
    "任务内容：请前往桃花村的道具店，帮助店主凯瑟琳":
      "Nội dung nhiệm vụ: Hãy đến tiệm đạo cụ Đào Hoa Thôn giúp đỡ chủ tiệm Khải Sắt Lâm",
    "          可以开启道具店，获得丹方和突破材料":
      "          để mở khóa tiệm đạo cụ, nhận được Đan Phương cùng nguyên liệu đột phá.",
    "任务地点：桃花村道具店":
      "Địa điểm nhiệm vụ: Tiệm đạo cụ Đào Hoa Thôn.",
    "如何进行：进入桃花村道具店和凯瑟琳对话":
      "Cách thực hiện: Tiến vào tiệm đạo cụ Đào Hoa Thôn đối thoại với Khải Sắt Lâm.",
    "任务内容：墨轩似乎知道哪里可以知道这一切的由来，":
      "Nội dung nhiệm vụ: Mặc Hiên dường như biết nơi có thể tìm hiểu nguồn gốc của toàn bộ chuyện này,",
    "          不过他需要10份六道碎片。":
      "          tuy nhiên y cần 10 phần Mảnh Vỡ Lục Đạo.",
    "任务地点：焚天域武器店":
      "Địa điểm nhiệm vụ: Tiệm vũ khí Phần Thiên Vực.",
    "如何进行：前往大地图，寻路，购买，然后回洞府交":
      "Cách thực hiện: Lên đại bản đồ tự động tìm đường mua, sau đó trở về động phủ giao",
    "          给墨轩。": "cho Mặc Hiên.",

    // --- Shop (Cat_ShopCoreUi) ---
    "当前商店使用货币：": "Tiền tệ hiện tại của cửa hàng:",
    "当前拥有货币数量：": "Số tiền hiện đang sở hữu:",
    "银两": "Lượng bạc",
    "消耗:": "Tiêu hao:",

    // --- LL windows (XdRs_LL_Windows) ---
    "是否确认使用物品？": "Có chắc chắn muốn sử dụng vật phẩm này?",
    "是否确认使用技能？": "Có chắc chắn muốn sử dụng kỹ năng này?",
    "卸下": "Tháo xuống",

    // --- Cat_NewWindow: menu commands ---
    "读取进度": "Load game",
    "保存进度": "Save game",
    "人物信息": "Thông tin nhân vật",
    "空间戒指": "Không Gian Giới Chỉ",
    "装备状态": "Trang bị",
    "技能玉石": "Kỹ Năng",
    "任务玉简": "Nhiệm Vụ",
    "私密日记": "Nhật Ký Tư Mật",
    "灵宠": "Linh Sủng",
    "传音玉简": "Truyền Âm Ngọc Giản",

    // --- Cat_NewWindow: menu time ---
    "修仙纪元": "Tu Tiên Kỷ Nguyên",
    "春": "Xuân",
    "夏": "Hạ",
    "秋": "Thu",
    "冬": "Đông",
    "坐标：": "Tọa độ:",
    "地点：": "Địa điểm:",

    // --- Fishing ---
    "选择鱼竿：": "Chọn cần câu:",
    "选择鱼饵：": "Chọn mồi:",
    "开始钓鱼": "Bắt đầu câu cá",
    "返回": "Trở về",
    "提示": "Gợi ý",
    鼠标点击想要投掷鱼漂的位置就可投掷鱼漂:
      "Click chuột vào vị trí muốn ném bobber để ném bobber",
    "鱼上钩后按下键盘→可进行拖拽":
      "Sau khi cá cắn câu, nhấn phím → để kéo cần",
    "鱼上钩后按下键盘←可延长当前鱼朝向时间":
      "Sau khi cá cắn câu, nhấn phím ← để kéo dài thời gian xoay người của cá",
    "在规定时间内快速敲击键盘→可成功捕鱼":
      "Nhấp liên tục phím → trong thời gian giới hạn để câu cá thành công",
    "结算": "Quyết toán",
    "确定": "Xác nhận",
    "恭喜你成功获得：": "Chúc mừng ngươi đã nhận được:",
    "你什么都没有获得！": "Ngươi không nhận được gì cả!",

    // --- Status screen (Cat_NewWindow + Cat_FinalSceneUi) ---
    "姓名：": "Tên:",
    "等级：": "Cấp độ:",
    "境界：": "Cảnh giới:",
    "生命": "Sinh Mệnh:",
    "生命：": "Hp:",
    "灵力": "Linh Lực:",
    "灵力：": "Mp:",
    "攻击": "Công Kích",
    "防御": "Phòng Ngự",
    "法攻": "Pháp Công",
    "法防": "Pháp Phòng",
    "身法": "Thân Pháp",
    "气运": "Khí Vận",
    "怒气：": "Nộ Khí:",
    "经验：": "Kinh Nghiệm:",
    "恶堕度：": "Độ Đọa Lạc:",
    "心魔：": "Tâm Ma:",
    "功德值：": "Công Đức Trị:",
    "精气进度：": "Tiến Độ Tinh Khí:",
    "孕值：": "Độ Thụ Thai:",
    "未破处": "Chưa phá Nguyên Âm",
    "破处者：": "Người phá Nguyên Âm:",
    "声望：": "Danh Vọng:",
    "风评：": "Danh Tiếng:",
    "人物状态&特性：": "Trạng thái & Đặc tính nhân vật:",
    "状态&特性": "Trạng thái & Đặc tính",
    "一阶段": "Nhất Giai",
    "二阶段": "Nhị Giai",
    "三阶段": "Tam Giai",
    "四阶段": "Tứ Giai",
    "五阶段": "Ngũ Giai",
    "无": "Không",

    //SM Text
    "谁敢触碰，一定打死他": "Kẻ nào dám đụng vào, nhất định đánh chết hắn.",
    "啊啊，接吻是这样滋味": "A a... thì ra hôn môi lại có tư vị như thế này.",
    "想要舌尖交融... ...": "Muốn được đầu lưỡi giao hòa... ...",
    "精液的味道有点腥臭": "Mùi vị của tinh dịch hơi tanh nồng.",
    "想要全身下上都是精液": "Muốn từ trên xuống dưới khắp toàn thân đều là tinh dịch.",
    "有点大，跑起来好晃": "Hơi lớn rồi, chạy lên thật rung lắc.",
    "嘤~乳头立起来，好硬": "Ưm~ Đầu vú dựng đứng lên rồi, cứng quá.",
    "啊~~胸部被揉捏的好舒服": "A~~ Ngực bị nhào nặn thật thoải mái.",
    "乳汁越来越多了想被人吸": "Sữa càng lúc càng nhiều, muốn được người khác bú.",
    "乳汁和精液的气味真好闻": "Mùi hương của sữa và tinh dịch thật là thơm.",
    "屁股有点大，不要看啦~~~": "Mông hơi lớn, đừng nhìn mà~~~",
    "怎么能使用那种地方///": "Làm sao có thể dùng nơi đó chứ ///",
    "啊，被抽插的好舒服。": "A... bị trừu cắm thật là thoải mái.",
    "想要被抽插的更多精液": "Muốn bị trừu cắm nhiều hơn, bắn thêm nhiều tinh dịch vào nữa.",
    "啊~~不够，再来更多❤": "A~~ Không đủ, cho ta thêm nữa đi ❤",
    "谁敢乱摸，就砍了他的手。": "Kẻ nào dám sờ loạn, liền chặt đứt tay hắn.",
    "嗯，好难受，被插的红肿":
      "Ưm, thật khó chịu, bị đâm cắm đến sưng đỏ.",
    "为什么感觉有些舒服。": "Tại sao... lại cảm thấy có chút thoải mái chứ.",
    "啊~~子宫里都是精液好温暖。": "A~~ Trong tử cung tràn ngập tinh dịch, thật là ấm áp.",
    "还想要更多更多，不要停下来。": "Còn muốn nhiều hơn nữa, đừng dừng lại.",

    // --- Cat_NewWindow: item categories ---
    "普通道具": "Đạo cụ phổ thông",
    "丹药": "Đan dược",
    "秘籍": "Bí tịch",
    "武器护具": "Trang bị",
    "武器": "Vũ khí",
    "无可强化装备": "Không có trang bị có thể cường hóa",
    "当前强化等级": "Cấp cường hóa hiện tại",
    "强化后提升": "Tăng lên sau cường hóa",
    "珍贵道具": "Bí Bảo",
    "剩餘：": "Còn lại:",
    "携带数量": "Số lượng mang theo",
    "没有物品": "Không có vật phẩm",
    "数量": "Số lượng",

	// --- Cat_ElixirCore ---
    "开始炼丹": "Bắt đầu luyện đan",
    "炼丹等级": "Cấp độ luyện đan",
    "炼丹经验": "Kinh nghiệm luyện đan",
    "炼丹熟练度": "Độ thuần thục luyện đan",
    "你成功炼制": "Bạn đã luyện chế thành công",
    "炼制失败，材料全部损毁...": "Luyện chế thất bại, toàn bộ nguyên liệu đã bị hủy...",

	// --- Cat_NewWindow: skills / equip ---
    "(无法使用)": "(Chưa thể sử dụng)",
    "消耗怒气：": "Tiêu hao Nộ khí:",
    "消耗灵力：": "Tiêu hao Linh lực:",
    "无消耗": "Không tiêu hao",
    "一键最强装备": "Trang bị nhanh",
    "更换装备": "Đổi trang bị",
    "【卸下该装备】": "【Tháo trang bị】",
    "持有：": "Sở hữu:",
    "攻击：": "Công kích:",
    "防御：": "Phòng ngự:",
    "术攻：": "Pháp Công：",
    "术防：": "Pháp Phòng：",
    "身法：": "Thân Pháp：",
    "悟性：": "Ngộ Tính：",

    // --- Cat_NewWindow: save / options ---
    "游戏时间：": "Thời gian chơi:",
    "档位": "Lưu Trữ",
    "离开游戏": "Thoát trò chơi",

    // --- Cat_NewWindow: contacts / pets ---
    "无联系人": "Không có liên hệ",
    "姓名：": "Tên:",
    "  好友度：": "  Thiện cảm:",
    "[已参战]": "[Đã xuất chiến]",
    "[休息]": "[Nghỉ ngơi]",
    "参战": "Xuất chiến",
    "休息": "Nghỉ ngơi",
    "投喂": "Cho ăn",
    "装备": "Trang bị",
    "没有可使用道具": "Không có đạo cụ khả dụng",
    "没有可装备驭灵环": "Không có Ngự Linh Hoàn có thể trang bị",
    "没有可装备技能": "Không có kỹ năng có thể trang bị",
    "技能栏": "Thanh kỹ năng",

    // --- Cat_NewWindow: battle ---
    "战斗结算": "Quyết toán chiến đấu",
    "等级: ": "Cấp độ: ",

    // --- FlyCat_LL_SceneMenu (map main menu / Scene_Menu) ---
    "生命力：": "Sinh Mệnh Trị:",
    "经验值：": "Kinh Nghiệm Trị:",
    "堕落值：": "Độ Đọa Lạc:",
    "心魔值：": "Tâm Ma Trị:",
    "魅力值：": "Mị Lực Trị:",
    "人物状态：": "Trạng thái nhân vật:",
    "灵石": "Linh Thạch",
    "金钱：": "Linh Thạch:",
    "还未领取主线任务！": "Chưa tiếp nhận nhiệm vụ chính!",
    "存档": "Save game",
    "读档": "Load game",
    "系统设置": "Thiết lập",
    "季节 : ": "Mùa: ",
    "（一阶）": "（Nhất Giai）",
    "（二阶）": "（Nhị Giai）",
    "（三阶）": "（Tam Giai）",
    "按下ESC跳过": "Nhấn ESC để bỏ qua",
    "开始强化": "Bắt đầu cường hóa",
    "开始升级": "Bắt đầu nâng cấp",
    "升级后装备": "Trang bị sau nâng cấp",
    "无可升级装备": "Không có trang bị có thể nâng cấp",
    "无法升级": "Không thể nâng cấp",
    "该装备未强化至最高等级": "Trang bị này chưa cường hóa đến cấp tối đa",
    "无法强化": "Không thể cường hóa",
    "该装备已强化至最高等级": "Trang bị này đã cường hóa đến cấp tối đa",
    "数量不足": "Số lượng không đủ",

    // ---------- DANFANG
    "恢复": "Hồi phục",
    "修炼": "Đột phá",
    "疑难杂症": "Nan bệnh",
    "筑基丹": "Trúc Cơ Đan",
    "青霜丹": "Thanh Sương Đan",
    "浑天丹": "Hỗn Thiên Đan",
    "水韵丹": "Thủy Vận Đan",
    "太清玉魂丹": "Thái Thanh Ngọc Hồn Đan",
    "仙芝漱魂丹": "Tiên Chi Sấu Hồn Đan",
    "玉华丹": "Ngọc Hoa Đan",
    "三花玉露丹": "Tam Hoa Ngọc Lộ Đan",
    "固魂丹": "Cố Hồn Đan",
    "三转青莲丹": "Tam Chuyển Thanh Liên Đan",
    "驱星锻体丹": "Khu Tinh Đoán Thể Đan",
    "通幽玄体丹": "Thông U Huyền Thể Đan",
    "无极合道丹": "Vô Cực Hợp Đạo Đan",
    "大道通玄丹": "Đại Đạo Thông Huyền Đan",
    "地魄渡劫丹": "Địa Phách Độ Kiếp Đan",
    "天魂化劫丹": "Thiên Hồn Hóa Kiếp Đan",
    "鸿蒙紫月散": "Hồng Mông Tử Nguyệt Tán",
    "金乌丸": "Kim Ô Hoàn",
    "紫飒露": "Tử Sáp Lộ",
    "精气丹": "Tinh Khí Đan",
    "玄元丹": "Huyền Nguyên Đan",
    "回气丹": "Hồi Khí Đan",
    "梦清散": "Mộng Thanh Tán",
    "凝火丹": "Ngưng Hỏa Đan",
    "金髓丸": "Kim Tủy Hoàn",
    "六乌金散": "Lục Ô Kim Tán",
    "元神丹": "Nguyên Thần Đan",
    "九窍金丹": "Cửu Khiếu Kim Đan",
    "千幻万月散": "Thiên Huyễn Vạn Nguyệt Tán",
    "金龙五转丸": "Kim Long Ngũ Chuyển Hoàn",
    "仙风丹": "Tiên Phong Đan",
    "紫心扶月散": "Tử Tâm Phù Nguyệt Tán",
    "幻心丹": "Huyễn Tâm Đan",
    "补天丹": "Bổ Thiên Đan",
    "六道散": "Lục Đạo Tán",
    "道心金丹": "Đạo Tâm Kim Đan",
    "万象丸": "Vạn Tượng Hoàn",
    "九转金丹": "Cửu Chuyển Kim Đan",
    "天道极丹": "Thiên Đạo Cực Đan",
    "极道散": "Cực Đạo Tán",
    "大道万化丸": "Đại Đạo Vạn Hóa Hoàn",
    "活血散": "Hoạt Huyết Tán",
    "生机丹": "Sinh Cơ Đan",
    "催灵丹": "Thôi Linh Đan",
    "锻灵丹": "Đoán Linh Đan",
    "妖灵丹": "Yêu Linh Đan",
    "天灵丹": "Thiên Linh Đan",
    "回魂香": "Hồi Hồn Hương",
    "痊愈丸": "Toàn Dũ Hoàn",
    "保气丹": "Bảo Khí Đan",
    "乳灵丸": "Nhũ Linh Hoàn",
    "金枪不倒丸": "Kim Thương Bất Đảo Hoàn",
    "花容丹": "Hoa Dung Đan",
    "续骨膏": "Tục Cốt Cao",
    "迷晕散": "Mê Vựng Tán",
    "通乳丸": "Thông Nhũ Hoàn",
    "乳汁丹": "Nhũ Trấp Đan",
    "清明散": "Thanh Minh Tán",
    "大补丸": "Đại Bổ Hoàn",
    "颠鸾倒凤丸": "Điên Loan Đảo Phượng Hoàn",

    // --- Status / menu labels (Admin_LanguageCore + other plugins) ---
    "基础属性": "Thuộc tính cơ bản",
    "已参战": "Đã tham gia chiến tranh",
    "休息": "Nghỉ ngơi",
    "普通": "Thường",
    "道侣": "Đạo lữ",
    "好友": "Bạn bè",
    "敌对": "Kẻ thù",
    "战": "Chiến",
    "斗": "Đấu",
    "逃": "Tẩu",
    "跑": "Thoát",
    "嘴巴内心：": "Tâm lý (Miệng):",
    "胸内心：": "Tâm lý (Ngực):",
    "小穴内心：": "Tâm lý (Tiểu Huyệt):",
    "后庭内心：": "Tâm lý (Hậu Đình):",
    "与人类次数：": "Số lần với nhân loại:",
    "与怪物次数：": "Số lần với yêu thú:",
    "被性骚扰次数：": "Số lần bị quấy rối:",
    "使用道具次数次数：": "Số lần dùng đạo cụ:",
    "强奸次数：": "Số lần bị cưỡng bức:",
    "轮奸次数：": "Số lần bị luân gian:",
    "引诱次数：": "Số lần dụ dỗ:",
    "强推次数：": "Số lần cường thôi:",
    "口交次数：": "Số lần khẩu giao:",
    "乳交次数：": "Số lần nhũ giao:",
    "肛交次数：": "Số lần hậu đình giao:",
    "法环": "Pháp Hoàn",
    "衣服": "Y Phục",
    "表情": "Biểu cảm",
    "头发": "Kiểu tóc",
    "头饰": "Trang sức đầu",
    "侮辱文字装饰": "Kình Diện Ấn Ký",
    "发饰": "Trang sức tóc",
    "清空": "Tháo hết",
    "类型": "Kiểu",
    "列表": "Danh sách",
    "展示": "Hiển thị",
    "前": "Trước",
    "右": "Phải",
    "左": "Bên trái",
    "后": "Sau",
    "修仙纪元": "Tu Tiên Kỷ Nguyên",
    "年": "Năm",
    "月": "Tháng",

    //Settings/Config
    "地图立绘开关": "Hiển thị lập họa bản đồ",
    "子宫内视图开关": "Hiển thị tử cung",
    "开启": "Bật",
    "关闭": "Tắt",
    "特殊光源": "Nguồn sáng đặc biệt",

    //Mini Information Window
    "特殊": "Đặc biệt",
    "学会技能": "Học được kỹ năng",
    "永久提升": "Tăng vĩnh viễn",
    "特殊效果": "Hiệu ứng đặc biệt",
    "解除弱化": "Giải trừ suy yếu",
    "解除强化": "Giải trừ cường hóa",
    "弱化": "Suy yếu",
    "强化": "Cường hóa",
    "解除状态": "Giải trừ trạng thái",
    "附加状态": "Đính kèm trạng thái",
    "消耗怒气": "Tiêu hao Nộ Khí",
    "恢复怒气": "Hồi phục Nộ Khí",
    "消耗灵力": "Tiêu hao Linh Lực",
    "恢复灵力": "Hồi phục Linh Lực",
    "消耗生命": "Tiêu hao Sinh Mệnh",
    "恢复生命": "Hồi phục Sinh Mệnh",
    "双倍掉落物品": "Nhân đôi vật phẩm rơi",
    "双倍金钱": "Nhân đôi linh thạch",
    "增加先发制人率": "Tăng tỷ lệ tiên thủ",
    "取消偷袭": "Hủy bỏ tập kích",
    "无遇敌": "Tránh gặp địch",
    "遇敌减半": "Tỷ lệ gặp địch giảm nửa",
    "保留TP": "Dự trữ TP",
    "自动战斗": "Tự động chiến đấu",
    "增加行动次数": "Tăng số lượng hành động",
    "装备槽类型": "Loại khe cắm thiết bị",
    "封印装备": "Thiết bị kín",
    "固定装备": "thiết bị cố định",
    "装备护甲类型": "Loại áo giáp trang bị",
    "装备武器类型": "Loại vũ khí được trang bị",
    "封印技能": "Kỹ năng phong ấn",
    "添加技能": "Thêm kỹ năng",
    "封印技能类型": "Loại kỹ năng phong ấn",
    "添加技能类型": "Thêm loại kỹ năng",
    "攻击追加次数": "Tấn công thêm lần nữa",
    "攻击速度补正": "Hiệu chỉnh tốc độ tấn công",
    "攻击时状态": "Trạng thái tấn công",
    "攻击时属性": "Thuộc tính khi tấn công",
    "经验值": "giá trị kinh nghiệm",
    "地形伤害": "thiệt hại địa hình",
    "魔法伤害": "sát thương phép thuật",
    "物理伤害": "thiệt hại vật chất",
    "TP补充率": "Tỷ lệ bổ sung TP",
    "MP消耗率": "Tỷ lệ tiêu hao MP",
    "药理知识": "Kiến thức dược lý",
    "恢复效果": "Hiệu quả hồi phục",
    "防御效果": "Hiệu quả phòng ngự",
    "受到攻击几率": "Tỷ lệ bị công kích",
    "命中率": "Tỷ lệ chính xác",
    "回避率": "Tỷ lệ né tránh",
    "暴击率": "Tỷ lệ bạo kích",
    "暴击回避": "Né tránh bạo kích",
    "法术回避率": "Tỷ lệ né tránh phép thuật",
    "法术反射": "Phản xạ phép thuật",
    "物理反击": "Phản kích vật lý",
    "生命恢复": "Hồi phục sinh mệnh",
    "灵力恢复": "Hồi phục linh lực",
    "怒气恢复": "Hồi phục nộ khí",
    "状态免疫": "Miễn dịch trạng thái",
    "有效度": "Tính hiệu dụng",

    // LETTERNPC
    "打招呼": "Chào hỏi",
    "切磋": "Luận bàn",
    "双修": "Song tu",
    "目前没有联系人": "Hiện tại không có liên hệ nào",
    "大师兄杜云": "Đại Sư Huynh Đỗ Vân",
    "师傅黄玉琉": "Sư Phụ Hoàng Ngọc Lưu",
    "二师兄云飞扬": "Nhị Sư Huynh Vân Phi Dương",
    "师姐聂敏": "Sư Tỷ Nhiếp Mẫn",
    "李爽": "Lý Sảng",
    "绫罗": "Lăng La",
    "周景初": "Chu Cảnh Sơ",
    "顾余生": "Cố Dư Sinh",
    "韩羽": "Hàn Vũ",
    "王舒": "Vương Thư",
    "顾星冉": "Cố Tinh Nhiễm",
    "赵明月": "Triệu Minh Nguyệt",
    "李雨纹": "Lý Vũ Văn",
    "赵明月": "Triệu Minh Nguyệt",
    "墨轩": "Mặc Hiên",
    "墨轩（化龙）": "Mặc Hiên (Hóa Long)",
    "我：": "Ta:",
    "好友度：": "Hảo cảm:",
    "简介：": "Giới thiệu:",
    "看你牛子": "Xem hạ bộ của huynh",
    "大师兄好": "Chào Đại Sư Huynh",
    "好\n\\C[14]测试第一行\n\\C[14]测试第二行\n\\C[14]测试第三行\I[10]":
      "Được\n\\C[14]Thử nghiệm dòng thứ nhất\n\\C[14]Thử nghiệm dòng thứ hai\n\\C[14]Thử nghiệm dòng thứ ba\I[10]",
    "师妹好": "Chào Sư Muội",
    "无须多礼": "Không cần đa lễ",
    "小师妹好": "Chào Tiểu Sư Muội",
    "月儿师妹...好": "Nguyệt Nhi Sư Muội... chào muội",
    "流云城城主府": "Lưu Vân Thành Thành Chủ Phủ",
    "进入流云城后一直向前走，走过河中小亭，继续前行\\C[14]看到一片竹林后继续前进就到城主府了。":
      "Sau khi tiến vào Lưu Vân Thành thì đi thẳng, đi qua tiểu đình trên sông, tiếp tục đi trước\\C[14] nhìn thấy một phiến trúc lâm tiếp tục tiến lên liền đến Thành Chủ Phủ.",
    "城主府每年12月可以进入，门口右边可以领任务。":
      "Thành Chủ Phủ hằng năm có thể tiến vào vào tháng 12, bên phải cổng lớn có thể nhận nhiệm vụ.",
    "流云城琉璃塔": "Lưu Vân Thành Lưu Ly Tháp",
    "流云城琉璃塔在流云城右边的出口，走过小桥就可以到达。":
      "Lưu Vân Thành Lưu Ly Tháp nằm ở lối ra bên phải Lưu Vân Thành, đi qua tiểu kiều là có thể đến.",
    "流云城琉璃村": "Lưu Vân Thành Lưu Ly Thôn",
    "琉璃村在琉璃岛野外右边山上右手边有个入口。":
      "Lưu Ly Thôn có một lối vào nằm ở phía bên phải ngọn núi bên phải dã ngoại Lưu Ly Đảo.",
    "师兄真棒": "Sư Huynh thật giỏi",
    "大师兄你比师傅更棒！":
      "Đại Sư Huynh, huynh còn giỏi hơn cả Sư Phụ nữa!",
    "大师兄你是宗门第一棒！":
      "Đại Sư Huynh, huynh là đệ nhất tông môn!",
    "师妹，你是这样认为吗？": "Sư Muội, muội nghĩ như vậy sao?",
    "师妹，你...": "Sư Muội, muội...",
    "师妹...月儿...你喜欢吗？": "Sư Muội... Nguyệt Nhi... muội thích không?",
    "师兄我修炼遇到点问题今晚方便来帮我下吗？":
      "Sư Huynh, muội gặp chút vấn đề trong tu luyện, tối nay huynh có tiện đến giúp muội một chút không?",
    "师妹，是在等我吗？": "Sư Muội, đang đợi huynh sao?",
    "师妹，你想要什么？": "Sư Muội, muội muốn cái gì?",
    "月儿...你": "Nguyệt Nhi... muội",
    "师兄你有试过在水里做那种事吗？":
      "Sư Huynh, huynh đã từng thử song tu ở dưới nước chưa?",
    "师妹我等修仙之人，不能一天到晚沉迷欲望。":
      "Sư Muội, chúng ta là người tu tiên, không thể suốt ngày trầm luân trong dục vọng.",
    "师妹想要试试吗？": "Sư Muội có muốn thử không?",
    "月儿想要吗？": "Nguyệt Nhi có muốn không?",
    "技能点": "Điểm kỹ năng",
    "修炼感悟": "Tu luyện cảm ngộ",
    "法则感悟": "Pháp tắc cảm ngộ",
    "规则感悟": "Quy tắc cảm ngộ",
    "怎么有技能点": "Làm sao để có điểm kỹ năng?",
    "闭关打坐，但打坐只能一年一次。":
      "Bế quan tọa thiền, nhưng tọa thiền mỗi năm chỉ được một lần.",
    "打怪物随机获得。": "Đánh bại quái vật sẽ ngẫu nhiên nhận được.",
    城主府藏书阁一楼或者望月阁一楼:
      "Tầng một Tàng Thư Các Thành Chủ Phủ hoặc tầng một Vọng Nguyệt Các.",
    "今晚我洞府没设防师兄别让我等太久哦？":
      "Tối nay động phủ của muội không thiết phòng bị, Sư Huynh đừng để muội đợi quá lâu nhé?",
    "师妹，别这样...": "Sư Muội, đừng như vậy...",
    "师兄师兄我新买的肚兜你要看看吗？":
      "Sư Huynh, yếm mới mua của muội, huynh có muốn xem thử không?",
    "师妹穿什么都好看": "Sư Muội mặc gì cũng đều đẹp cả",
    "师妹，女孩子要矜持。": "Sư Muội, nữ tử phải rụt rè một chút.",
    "今天是我危险期不过是师兄的话也没关系呢。":
      "Hôm nay là kỳ nguy hiểm của muội, nhưng nếu là Sư Huynh thì cũng không sao đâu.",
    "师妹慎言": "Sư Muội hãy cẩn thận lời nói",
    "师妹不要考验我": "Sư Muội đừng thử thách huynh",
    "你再说什么？": "Ngươi đang nói cái gì?",
    "我不知道你在说什么？": "Ta không biết ngươi đang nói cái gì?",
    "你想干嘛？": "Ngươi muốn làm gì?",
    "说人话！": "Nói tiếng người đi!",
    "你个老逼登": "Cái đồ lão bất tử",
    "老逼登你要爆装备了吗？": "Lão bất tử, ngươi chuẩn bị bạo trang bị sao?",
    "你说我骂你？你心里没数吗？":
      "Ngươi nói ta mắng ngươi? Trong lòng ngươi tự biết rõ đi?",
    "一决生死吧！": "Quyết một trận tử sinh đi!",
    "你找死": "Ngươi tìm chết",
    "孽徒": "Nghiệt đồ",
    "我当初救你是我的错": "Năm đó ta cứu ngươi là lỗi của ta",
    "你造反了是吧？": "Ngươi muốn tạo phản đúng không?",
    "师傅好": "Chào Sư Phụ",
    "师傅能教导一下我的修行吗？": "Sư Phụ có thể chỉ điểm tu hành cho con không?",
    "师傅我这里还有些不明白": "Sư Phụ, con vẫn còn vài chỗ chưa hiểu rõ",
    "师傅还请教我更深的修行之道。":
      "Sư Phụ hãy dạy cho con con đường tu hành thâm sâu hơn.",
    "月儿，你真是越来越调皮了。":
      "Nguyệt Nhi, con thật là càng ngày càng nghịch ngợm.",
    "为师正在修炼。": "Vi sư đang tu luyện.",
    "月儿得多练练心，不可如此急躁。":
      "Nguyệt Nhi phải tu tâm dưỡng tính nhiều hơn, không thể nóng vội như thế.",
    "大师兄": "Đại Sư Huynh",
    "怎么看大师兄": "Nghĩ thế nào về Đại Sư Huynh?",
    "杜云": "Đỗ Vân",
    "我爱大师兄": "Con yêu Đại Sư Huynh",
    "杜云是一个不错的孩子，就是可惜了。":
      "Đỗ Vân là một đứa trẻ ngoan, thật là đáng tiếc.",
    "嗯？杜云也不知道什么能走出来。":
      "Ừm? Đỗ Vân cũng không biết khi nào mới có thể thoát ra được.",
    "月儿，修士要以修行为主。":
      "Nguyệt Nhi, tu sĩ phải lấy tu luyện làm trọng.",
    "二师兄": "Nhị Sư Huynh",
    "怎么看二师兄": "Nghĩ thế nào về Nhị Sư Huynh?",
    "云飞扬": "Vân Phi Dương",
    "我爱二师兄": "Con yêu Nhị Sư Huynh",
    "飞扬啊，月儿你觉得如何呢？。":
      "Phi Dương sao, Nguyệt Nhi con thấy thế nào?",
    "飞扬，还需要多多历练。":
      "Phi Dương vẫn cần phải rèn luyện nhiều hơn.",
    "聂敏": "Nhiếp Mẫn",
    "怎么看师姐": "Nghĩ thế nào về Sư Tỷ?",
    "师姐": "Sư Tỷ",
    "我爱师姐": "Con yêu Sư Tỷ",
    "我要和师姐双修": "Con muốn cùng Sư Tỷ song tu",
    "敏儿，唔...月儿还是多注意自己。":
      "Mẫn Nhi sao, ưm... Nguyệt Nhi con vẫn nên chú ý bản thân mình nhiều hơn.",
    "月儿喜欢敏儿？": "Nguyệt Nhi thích Mẫn Nhi sao?",
    "师傅是不是隐瞒了什么？": "Sư Phụ có phải đang che giấu điều gì không?",
    "月儿，为师会隐瞒你什么呢？你不要想太多。":
      "Nguyệt Nhi, vi sư có thể che giấu con chuyện gì chứ? Đừng nghĩ quá nhiều.",
    "（一切都是为了宗门未来。）": "(Tất cả đều vì tương lai của tông môn.)",
    "师傅当年皇宫那到底是什么？":
      "Sư Phụ, năm đó ở hoàng cung rốt cuộc đã xảy ra chuyện gì?",
    "月儿，当年那成大火来的蹊跷，我知你心里不舒服，但是也没办法。":
      "Nguyệt Nhi, trận đại hỏa năm đó đến rất kỳ lạ, ta biết trong lòng con không thoải mái, nhưng cũng hết cách rồi.",
    "一切就是你看到的。": "Mọi chuyện đúng như những gì con đã thấy.",
    "为了师傅我可以做任何事情。": "Vì Sư Phụ con có thể làm bất cứ chuyện gì.",
    "月儿你这话让为师非常满意": "Nguyệt Nhi, câu nói này của con làm vi sư rất hài lòng.",
    "月儿真乖": "Nguyệt Nhi thật ngoan",
    "师傅你究竟在想什么？": "Sư Phụ, rốt cuộc Người đang nghĩ gì?",
    "我只想凌霄宫崛起，但是，一个人太少了。":
      "Ta chỉ muốn Lăng Tiêu Cung trỗi dậy, thế nhưng lực lượng một người là quá đơn bạc.",
    "你说的为师不是很懂。":
      "Những lời con nói vi sư không hiểu lắm.",
    "二师兄好": "Chào Nhị Sư Huynh",
    "嗯，小师妹，你看起来很有空。":
      "Ừm, Tiểu Sư Muội, trông muội có vẻ rảnh rỗi nhỉ.",
    "小师妹要是无聊可以来找师兄。":
      "Tiểu Sư Muội nếu thấy nhàm chán có thể tới tìm sư huynh.",
    "二师兄你在干嘛？": "Nhị Sư Huynh, huynh đang làm gì thế?",
    "我在研究人体，为什么有人有灵感有人却没有呢？":
      "Ta đang nghiên cứu nhân thể, vì sao có người có linh căn còn có người lại không?",
    "人类的身体真让人着迷": "Thân thể nhân loại thật khiến người ta mê mẩn.",
    "我在喝酒，你来吗？": "Ta đang uống rượu, muội có đến không?",
    "炼丹，师傅给的任务，你做完了？":
      "Luyện đan, nhiệm vụ Sư Phụ giao, muội đã hoàn thành chưa?",
    "小师妹是想来找我吗？":
      "Tiểu Sư Muội muốn tới tìm ta sao?",
    "二师兄你有喜欢的人吗？":
      "Nhị Sư Huynh, huynh có người trong lòng chưa?",
    "小师妹这样说是吃醋了吗？":
      "Tiểu Sư Muội nói vậy là đang ghen sao?",
    "这个可是秘密。": "Chuyện này là bí mật nha.",
    "小师妹想要听什么样的回答呢？":
      "Tiểu Sư Muội muốn nghe câu trả lời thế nào?",
    "二师兄又要喝酒了？":
      "Nhị Sư Huynh lại muốn uống rượu sao?",
    "酒可是好东西，小师妹，你以后会明白的。":
      "Rượu ngon là thứ tốt, Tiểu Sư Muội, sau này muội sẽ hiểu thôi.",
    "二师兄你之前在哪里？": "Nhị Sư Huynh, trước đây huynh ở đâu thế?",
    "我在一个偏僻的小村子里，大家都很怕我，我也很烦恼，没想到会遇到师傅。\\C[14]离开那个村子，现在整个人都很好，好好修仙真不错。":
      "Tôi đang ở một ngôi làng xa xôi. Mọi người đều sợ tôi. Tôi cũng rất bối rối. Tôi không mong đợi được gặp chủ nhân.\\C[14]Sau khi rời khỏi ngôi làng đó, mọi người đều ở trong tình trạng tốt. Thật tuyệt vời khi tu luyện tốt trường sinh bất tử.",
    "你可以再多数详细一点。": "Huynh có thể nói chi tiết hơn một chút không.",
    "怎么，是想我了？": "Sao thế, nhớ ta rồi sao?",
    "师妹，为什么不好好说话，是太喜欢我了吗？":
      "Sư Muội, sao không chịu nói chuyện đàng hoàng, là quá thích ta rồi phải không?",
    "师姐好": "Chào Sư Tỷ",
    "小师妹你来了。": "Tiểu Sư Muội, muội tới rồi.",
    "小师妹真的好漂亮。": "Tiểu Sư Muội thật là xinh đẹp.",
    "小师妹来师姐这里。":
      "Tiểu Sư Muội, lại đây với sư tỷ.",
    "师姐在做什么？": "Sư Tỷ đang làm gì thế?",
    "我在做自己最喜欢的东西。": "Ta đang làm thứ ta thích nhất.",
    "山下的村民出事了，我再帮忙。":
      "Dân làng dưới núi xảy ra chuyện, ta đang giúp một tay.",
    "小师妹也要一起吗？": "Tiểu Sư Muội có muốn đi cùng không?",
    "师姐喜欢谁呢？": "Sư Tỷ thích ai thế?",
    "我喜欢的人啊是难以得到的人。":
      "Người ta thích... là người khó mà có được.",
    "呵呵，以后你会知道的。": "Ha ha, sau này muội sẽ biết thôi.",
    "师姐这东西是大师兄送的。":
      "Sư Tỷ, thứ này là Đại Sư Huynh tặng sao?",
    "师姐二师兄找我喝酒。":
      "Sư Tỷ, Nhị Sư Huynh rủ muội đi uống rượu.",
    "是吗？师妹很喜欢这些东西吗？":
      "Thế sao? Sư Muội rất thích những thứ này à?",
    "师妹，可以找我，我也能。":
      "Sư Muội, có thể tìm ta, ta cũng có thể.",
    "师妹，师姐会送更好的给你。":
      "Sư Muội, sư tỷ sẽ tặng thứ tốt hơn cho muội.",
    "师姐我一个人睡觉害怕。": "Sư Tỷ, muội ngủ một mình sợ lắm.",
    "师姐你有在意的人吗？": "Sư Tỷ, tỷ có người nào để ý không?",
    "师姐我好像喜欢上谁了。":
      "Sư Tỷ, hình như muội thích một người rồi.",
    "师妹，师姐永远在你身边。":
      "Sư Muội, sư tỷ sẽ luôn ở bên cạnh muội.",
    "师妹，师妹... ..": "Sư Muội, sư muội... ...",
    "师妹是最好的。": "Sư Muội là tốt nhất.",
    "师姐你来自哪里？": "Sư Tỷ, tỷ đến từ đâu thế?",
    "我是一个孤儿，吃百家饭长大的，多愧师傅发现了我。":
      "Ta là trẻ mồ côi, ăn cơm trăm nhà mà lớn, may nhờ Sư Phụ phát hiện ra ta.",
    "师姐修炼了多久？": "Sư Tỷ đã tu luyện được bao lâu rồi?",
    "师姐也不记得了，蛮久了。":
      "Sư tỷ cũng không nhớ rõ, đã rất lâu rồi.",
    "师妹再说一下吗，师姐好寂寞。":
      "Sư Muội nói thêm vài câu đi, sư tỷ cô đơn quá.",
    "师妹，慢慢来，师姐听着呢。":
      "Sư Muội cứ thong thả, sư tỷ đang nghe đây.",
    "你来自哪里？": "Ngươi đến từ đâu thế?",
    "我来自平行界面的未来，哪里都是凡人。":
      "Ta đến từ tương lai của một không gian song song, nơi đó toàn bộ đều là phàm nhân.",
    "你来的地方是什么样的？": "Nơi ngươi đến trông thế nào?",
    "那里灵气稀薄，大家都是凡人，比起修仙更向往科技。":
      "Nơi đó linh khí mỏng manh, ai ai cũng là phàm nhân, so với tu tiên thì càng hướng tới khoa học kỹ thuật hơn.",
    "你可真可爱啥都敢想。":
      "Ngươi thật đáng yêu, chuyện gì cũng dám nghĩ.",
    "你们这的仙子没想到也是这等鸟样。":
      "Không ngờ tiên tử ở chỗ các ngươi cũng là cái dạng đức hạnh này.",
    "那你连自己人都保护不了，有什么资格笑我。":
      "Đến cả người bên cạnh mình ngươi còn không bảo vệ được, có tư cách gì cười nhạo ta.",
    "区区炼气期境，也想驱使我。":
      "Khu khu Luyện Khí Kỳ mà cũng muốn sai khiến ta.",
    "也好比你被天道驱使。":
      "Cũng giống như việc ngươi bị Thiên Đạo sai khiến vậy.",
    "你想念故乡吗？": "Ngươi có nhớ quê hương không?",
    "想，但是回不去。": "Nhớ chứ, nhưng không về được.",
    "想，火锅、冰淇淋和各种零食。":
      "Có, nhớ lẩu, kem ly và đủ loại đồ ăn vặt.",
    "你有想继续修仙吗？": "Ngươi có muốn tiếp tục tu tiên không?",
    "修仙再好，也有有命，我灵根不是很好。":
      "Tu tiên dù tốt nhưng cũng phải giữ được mạng, linh căn của ta không tốt lắm.",
    "修仙我想啊，但是，我更想回家。":
      "Tu tiên ta cũng muốn chứ, nhưng ta càng muốn về nhà hơn.",
    "有事吗？": "Có chuyện gì không?",
    "我不知道": "Ta không biết",
    "啊对对对": "A đúng đúng đúng",
    "今天又偷懒了吗": "Hôm nay lại lười biếng rồi sao?",
    "嘿嘿嘿，\n[1]也来一起吗？": "Hắc hắc hắc,\n[1] cũng muốn tham gia cùng sao?",
    "你为什么这么喜欢吃甜点？": "Tại sao ngươi lại thích ăn đồ ngọt thế?",
    "因为人生太苦了，只有甜点能欺骗内心，人生还是有点甜的。":
      "Bởi vì cuộc đời quá đắng cay, chỉ có đồ ngọt mới xoa dịu được lòng người, cuộc sống vẫn cần có chút ngọt ngào.",
    "我想你": "Ta nhớ ngươi",
    "我也想你": "Ta cũng nhớ ngươi",
    "你在哪里，我来找你": "Ngươi ở đâu, ta đi tìm ngươi",
    "你什么时候有空，想和你... ...":
      "Khi nào ngươi rảnh rỗi, ta muốn cùng ngươi... ...",
    "只要你想，我都有空。": "Chỉ cần ngươi muốn, lúc nào ta cũng rảnh.",
    "那个剑灵还好吗？": "Kiếm linh kia vẫn tốt chứ?",
    "哎，它好唠叨啊。": "Haizz, y lải nhải phiền phức quá.",
    "我在想他是不是太久没有遇到人了。":
      "Ta đang nghĩ có phải do đã quá lâu y chưa được gặp con người hay không.",
    "不理你了": "Không thèm để ý ngươi nữa",
    "我又错了什么吗？不要不理我。":
      "Ta lại làm sai cái gì sao? Đừng ngó lơ ta mà.",
    "我也不理你了。": "Ta cũng không thèm để ý ngươi nữa.",
    "怎么了，有什么需要我的吗？":
      "Sao thế, có chỗ nào cần đến ta sao?",
    "这个我不知道": "Chuyện này ta không biết",
    "别这样，我不是很喜欢": "Đừng như vậy, ta không thích lắm",
    "真想离开你": "Thực sự muốn rời khỏi ngươi",
    "呵呵，那我会杀了你，绝对绝对不要离开。":
      "Ha ha, vậy ta sẽ giết ngươi, tuyệt đối tuyệt đối đừng hòng rời đi.",
    "你真狠喜欢喜欢我妈？": "Ngươi thật tàn nhẫn... có thực sự thích ta không?",
    "喜欢，很喜欢你，但是，我更想看你崩溃的样子。":
      "Thích chứ, rất thích ngươi, nhưng ta lại càng thích nhìn dáng vẻ lúc ngươi sụp đổ hơn.",
    "你真是大变态": "Ngươi đúng là một tên biến thái lớn",
    "对，但只对你变态": "Phải, nhưng ta chỉ biến thái với một mình ngươi",
    "请不要这样说我，不然我会更加变态":
      "Xin đừng nói ta như vậy, nếu không ta sẽ càng biến thái hơn đấy",
    "伤害我，会让你快乐吗？": "Làm tổn thương ta, khiến ngươi cảm thấy vui vẻ sao?",
    "是的，但只有我能伤害你。": "Phải, nhưng chỉ có ta mới được phép tổn thương ngươi.",
    "迟早我会杀了你": "Sớm muộn gì ta cũng sẽ giết ngươi",
    "能被你杀死真是太好了。":
      "Được chết dưới tay ngươi thì thật là tốt quá.",
    "我只想死在你手上。": "Ta chỉ muốn được chết trong tay ngươi.",
    "我永远不会回来了": "Ta sẽ vĩnh viễn không bao giờ trở lại nữa",
    "那我就先杀了你，再自杀，这样我们就永远在一起了":
      "Vậy ta sẽ giết ngươi trước, sau đó tự sát, như thế chúng ta sẽ vĩnh viễn được ở bên nhau",
    "我会一直跟着你，杀了你。": "Ta sẽ bám theo ngươi mãi, cho đến khi giết chết ngươi.",
    "你在哪里！！别躲着我！！": "Ngươi đang ở đâu!! Đừng có trốn tránh ta!!",
    "你在问什么？": "Ngươi đang hỏi cái gì thế?",
    "不要离开我": "Đừng rời bỏ ta",
    "今天好想你": "Hôm nay rất nhớ ngươi",
    "你现在干什么？敲木鱼吗？":
      "Ngươi bây giờ đang làm gì thế? Gõ mộc ngư sao?",
    "怎么会，我可是武僧，要修炼的。":
      "Làm sao thế được, ta là võ tăng, còn phải tu luyện.",
    "今天去秘境了，看到一个男人背影好像你":
      "Hôm nay đi bí cảnh, nhìn thấy bóng lưng một nam nhân rất giống ngươi",
    "这么想我吗？": "Nhớ ta đến thế sao?",
    "我就来找你": "Ta đến tìm ngươi đây",
    "一起去打邪修吧": "Cùng nhau đi tiêu diệt tà tu đi",
    "好啊，一起除恶扬善":
      "Được chứ, cùng nhau trừ gian diệt ác, tuyên dương chính nghĩa",
    "送你甜食要不要？": "Tặng ngươi chút đồ ngọt, muốn lấy không?",
    "不要": "Không cần",
    "太甜了，还是小女生吃比价好":
      "Quá ngọt rồi, để cho mấy tiểu cô nương ăn thì hơn",
    "你会永远在我身边吧？": "Ngươi sẽ vĩnh viễn ở bên cạnh ta chứ?",
    "当然，我对佛祖发誓": "Tự nhiên rồi, ta xin thề trước Phật Tổ",
    "那你也会吧？": "Vậy ngươi cũng sẽ thế chứ?",
    "有事没看到": "Có chút việc nên không thấy tin nhắn",
    "要不问问佛祖？": "Hay là đi hỏi Phật Tổ xem sao?",
    "不清楚": "Không rõ nữa",
    "你喜欢什么样的灵兽？": "Ngươi thích loại linh thú nào?",
    "当然是强大的": "Dĩ nhiên là loài mạnh mẽ rồi",
    "你会和灵兽做事吗？": "Ngươi có làm chuyện đó với linh thú không?",
    "当然，其实很舒服的": "Đương nhiên, kỳ thực phi thường thoải mái",
    "这个灵兽你喜欢吗？喜欢我就给你。":
      "Ngươi thích con linh thú này sao? Thích thì ta liền tặng cho ngươi.",
    "好啊，谢谢！~~": "Tốt quá, cảm ơn ngươi nhé! ~~",
    "今天干什么？": "Hôm nay làm gì thế?",
    "依旧照顾我的灵兽，哦，还有修炼。":
      "Vẫn như cũ chăm sóc linh thú của ta, ồ, còn có tu luyện.",
    "这个灵果对你有用吗？": "Linh quả này có ích cho ngươi không?",
    "啊有用，谢谢了": "A có ích, cảm ơn ngươi nhé",
    "正好需要呢。": "Đang cần tới nó đây.",
    "你好弱。": "Ngươi thật yếu.",
    "你才弱！": "Ngươi mới yếu ấy!",
    "怎么了？": "Sao thế?",
    "不知啊": "Không biết nữa",
    "再想想": "Nghĩ lại xem",
    "灵兽宗很垃圾的。": "Linh Thú Tông rất rác rưởi.",
    "凌霄宫又有多好，都没了。":
      "Lăng Tiêu Cung thì tốt hơn bao nhiêu chứ, đều đã bị diệt môn rồi.",
    "有新出的妖兽消息吗？": "Có tin tức gì về yêu thú mới xuất hiện không?",
    "暂时没有，你要不要来交配看看？":
      "Tạm thời chưa có, ngươi có muốn tới đây thử giao phối không?",
    "不知道啦": "Không biết đâu nha",
    "哎，别问啦": "Haizz, đừng hỏi nữa mà",
    "你这什么脑袋？": "Đầu óc ngươi nghĩ cái gì thế?",
    "要不要一起出去玩？": "Muốn cùng nhau đi chơi không?",
    "好啊": "Được chứ",
    "等我一下": "Chờ ta một chút",
    "灵兽宗有什么好的，全靠灵兽。":
      "Linh Thú Tông có gì tốt chứ, toàn bộ đều phải dựa vào linh thú.",
    "凌霄宫还全靠嗑药": "Lăng Tiêu Cung còn chẳng phải là toàn dựa vào cắn thuốc đan dược sao",
    "这个花很好看，送给你。": "Đóa hoa này rất đẹp, tặng cho ngươi này.",
    "谢谢我很喜欢": "Cảm ơn ngươi, ta rất thích",
    "真香": "Thật là thơm",
    "你喜欢什么灵兽？": "Ngươi thích linh thú nào?",
    "什么我都喜欢，现在灵兽宗的灵兽太少了。":
      "Cái nào ta cũng thích cả, chỉ là linh thú của Linh Thú Tông bây giờ ít quá.",
    "哈哈哈，你的衣服好难看。": "Ha ha ha, y phục của ngươi xấu xí quá.",
    "你的也不怎样": "Của ngươi cũng chẳng ra sao cả",
    "那你给我做一件？": "Vậy ngươi làm cho ta một bộ đi?",
    "要不要去吃一顿？": "Muốn đi ăn một bữa không?",
    "去哪里？": "Đi đâu thế?",
    "不知道": "Không biết",
    "别问": "Đừng hỏi nữa",
    "哇，你看这个灵兽，超可爱。":
      "Oa, ngươi nhìn con linh thú này xem, siêu cấp đáng yêu luôn.",
    "确实": "Quả thực vậy",
    "一起去秘境如何？": "Cùng nhau đi bí cảnh thế nào?",
    "哪里秘境，我看看": "Bí cảnh ở đâu, để ta xem nào",
    "有什么好的灵兽推荐？": "Có linh thú nào tốt đề cử không?",
    "白虎吧": "Bạch Hổ đi",
    你适合找抗揍的灵兽:
      "Ngươi chỉ hợp tìm mấy con linh thú da dày thịt béo chịu đòn thôi.",
    "啊，灵兽宗还有什么灵兽？":
      "A, Linh Thú Tông còn có linh thú nào khác sao?",
    "不太多了": "Không còn nhiều lắm",
    "哈哈哈，今天再来切磋！": "Ha ha ha, hôm nay lại đến luận bàn nào!",
    "速来": "Mau tới đây",
    "我还是觉得打铁还是自身铁。":
      "Ta vẫn thấy rèn sắt thì bản thân mình phải cứng trước.",
    "说的嗑药是什么很好的事？":
      "Làm như cắn thuốc đan dược là chuyện vẻ vang lắm ấy?",
    "不知": "Không rõ",
    "找别人问去": "Đi hỏi người khác đi",
    "进入金丹期最好的修炼场所是琉璃塔？":
      "Nơi tu luyện tốt nhất sau khi tiến vào Kim Đan Kỳ là Lưu Ly Tháp sao?",
    "是的，不仅可以修炼，还能获得很多材料。":
      "Đúng thế, không chỉ có thể tu luyện, mà còn kiếm được rất nhiều nguyên liệu.",
    "突破金丹期进入元婴期的丹方在哪里？":
      "Đan phương đột phá Kim Đan Kỳ để tiến vào Nguyên Anh Kỳ ở đâu thế?",
    "桃花村的道具店和望月阁的三楼都有丹方，还有材料。":
      "Tiệm đạo cụ ở Đào Hoa Thôn và tầng ba Vọng Nguyệt Các đều có đan phương cùng nguyên liệu.",
    "养魂草在哪里？": "Dưỡng Hồn Thảo ở đâu thế?",
    "桃花村的道具店": "Tiệm đạo cụ ở Đào Hoa Thôn.",
    "每到境界需要突破的需要丹方在哪里？":
      "Đan phương cần thiết để đột phá mỗi khi đại cảnh giới tăng lên nằm ở đâu?",
    "大部分在望月阁就有，但炼虚后的需要去焚天域。":
      "Đa số ở Vọng Nguyệt Các là có sẵn, nhưng từ Luyện Hư Kỳ trở đi thì bắt buộc phải tới Phần Thiên Vực.",
    "化神期后哪里有更多的技能学习？":
      "Sau Hóa Thần Kỳ có thể học thêm nhiều kỹ năng ở đâu?",
    "焚天域的修仙者联盟和黑市里的比武台。":
      "Tu Tiên Giả Liên Minh tại Phần Thiên Vực và Lôi Đài ở Hắc Thị.",
    "魔界可以做什么？": "Ở Ma Giới có thể làm những gì?",
    "魔界可以购买一些合体期到大乘的丹方和材料。":
      "Tại Ma Giới có thể mua đan phương cùng nguyên liệu từ Hợp Thể Kỳ cho tới Đại Thừa Kỳ.",
    "除了琉璃塔还有什么可以修炼的地方？":
      "Ngoài Lưu Ly Tháp ra thì còn nơi nào có thể tu luyện được nữa không?",
    "云霓大陆有五行秘境可以挑战，但最低需要元婴期。":
      "Vân Nghê Đại Lục có Ngũ Hành Bí Cảnh có thể khiêu chiến, nhưng tu vi tối thiểu phải đạt Nguyên Anh Kỳ.",
    "云霓大陆上的秘境可以获得什么？":
      "Tại các bí cảnh trên Vân Nghê Đại Lục có thể nhận được những gì?",
    "根据不同属性，可以获得升级经验、炼丹材料、增加人物和灵兽属性的道具。":
      "Tùy thuộc vào thuộc tính khác nhau, có thể nhận được kinh nghiệm thăng cấp, nguyên liệu luyện đan cùng đạo cụ gia tăng thuộc tính cho nhân vật và linh thú.",
    "为什么有些地方不能进入？": "Tại sao có một số nơi không thể tiến vào?",
    "有些地方需要一定等级才会开放，当然要是剧情到了最后会全部开放。":
      "Có một số nơi yêu cầu tu vi/cấp độ nhất định mới mở ra, tất nhiên nếu cốt truyện tiến triển đến cuối cùng thì toàn bộ sẽ được mở khóa.",
    "你很啰嗦": "Ngươi thật là dài dòng",
    "本座不想说话": "Bổn tọa không muốn nói chuyện",

    // --- VictoryUI ---
    "获得灵石": "Nhận được Linh Thạch",
    "获得修为": "Nhận được tu vi",
    "获得物品": "Nhận được vật phẩm",
    "升级": "Thăng cấp",
    "Nine-Tailed Fox: Cửu Vĩ Hồ": "Cửu Vĩ Hồ",
  };

  const TEXT_MAP_SORTED = Object.keys(TEXT_MAP).sort(
    (a, b) => b.length - a.length,
  );

  // ---------------------------------------------------------------------------
  // Layer 1: Global drawText / drawTextEx translation
  // ---------------------------------------------------------------------------

  aliasMethod(
    Window_Base.prototype,
    "drawText",
    function (origin, text, x, y, maxWidth, align) {
      return origin.call(this, applyTextMap(text), x, y, maxWidth, align);
    },
  );

  aliasMethod(
    Window_Base.prototype,
    "drawTextEx",
    function (origin, text, x, y, width) {
      return origin.call(this, applyTextMap(text), x, y, width);
    },
  );

  aliasMethod(
    Window_Command.prototype,
    "addCommand",
    function (origin, name, symbol, enabled, ext) {
      return origin.call(this, applyTextMap(name), symbol, enabled, ext);
    },
  );

  
  Window_Base.prototype.wrapTextEx = function (text, maxWidth) {
    const paragraphs = String(text).split("\n");
    this.resetFontSettings();
    let finalLine = "";
    let linecount = 0;
    let prevLine = "";

    for (let p = 0; p < paragraphs.length; p++) {
      const words = paragraphs[p].split(" ");
      let currentLine = "";
      if (p > 0) {
        if (linecount < 2) {
          finalLine += "\n";
          linecount++;
        }
      }

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const testWidth = this.textSizeEx(
          linecount > 1 ? prevLine + testLine : testLine,
        ).width;

        if (testWidth > maxWidth - 30 && currentLine !== "") {
          finalLine += currentLine + "\n";
          linecount++;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      finalLine += currentLine;
      if (currentLine) linecount++;
      if (linecount > 1) prevLine = currentLine;
    }

    return finalLine;
  };

  // ---------------------------------------------------------------------------
  // Layer 2: Window_Help text wrap (replaces js-tl rmmz_windows.js edit)
  // ---------------------------------------------------------------------------

  Window_Help.prototype.wrapTextEx = function (text, maxWidth) {
    const paragraphs = String(text).split("\n");
    this.resetFontSettings();
    let finalLine = "";
    let linecount = 0;
    let prevLine = "";

    for (let p = 0; p < paragraphs.length; p++) {
      const words = paragraphs[p].split(" ");
      let currentLine = "";
      if (p > 0) {
        if (linecount < 2) {
          finalLine += "\n";
          linecount++;
        }
      }

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const testWidth = this.textSizeEx(
          linecount > 1 ? prevLine + testLine : testLine,
        ).width;

        if (testWidth > maxWidth - 30 && currentLine !== "") {
          finalLine += currentLine + "\n";
          linecount++;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      finalLine += currentLine;
      if (currentLine) linecount++;
      if (linecount > 1) prevLine = currentLine;
    }

    return finalLine;
  };

  aliasMethod(Window_Help.prototype, "refresh", function (origin) {
    const rect = this.baseTextRect();
    this.contents.clear();
    const wrapped = this.wrapTextEx(applyTextMap(this._text), rect.width);
    this.drawTextEx(wrapped, rect.x, rect.y, rect.width);
  });

  // ---------------------------------------------------------------------------
  // Layer 3: layoutFixes — shop item list (Cat_ShopCoreUi)
  // ---------------------------------------------------------------------------

  if (typeof Window_ShopItemList !== "undefined") {
    aliasMethod(
      Window_ShopItemList.prototype,
      "drawItem",
      function (origin, index) {
        if ($gameSystem._ItemShop[this._shopId].type) {
          var useItemNumber = $gameParty.gold();
          var useItems = null;
        } else {
          var useItems = $gameSystem._ItemShop[this._shopId].useItem;
          var useItemNumber = $gameParty.numItems(useItems);
        }
        const rect = this.itemLineRect(index);
        if (index == this.index()) {
          this.drawCursorBitmap(rect, 0);
        } else {
          this.drawCursorBitmap(rect, 1);
        }
        const item = this._list[index];
        const itemNumber = this._listNubmer[index];
        if (useItemNumber < itemNumber) {
          this.changeTextColor(ColorManager.textColor(10));
          this.contents.outlineColor = ColorManager.textColor(10);
          this.contents.outlineWidth = 0;
        } else if (Imported.FlyCat_CoreEngine) {
          this.changeTextColor("#462a39");
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
        } else {
          this.changeTextColor("#462a39");
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
        }
        if (item) {
          this.drawIcon(item.iconIndex, rect.x + 10, rect.y - 6);
          this.contents.fontSize = 16;
          this.drawText(
            item.name,
            rect.x + 36 + 10,
            rect.y - 10,
            this.width / this.maxCols(),
            "left",
          );
          this.contents.fontSize = 14;
          this.resetTextColor();
          if (useItemNumber < itemNumber) {
            this.changeTextColor(ColorManager.textColor(10));
            this.contents.outlineColor = ColorManager.textColor(10);
            this.contents.outlineWidth = 0;
          }
          var text;
          if (useItems) {
            text = useItems.name + ":";
          } else {
            text = applyTextMap("银两:");
          }
          this.changeTextColor("#462a39");
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
          this.drawText(
            text + itemNumber,
            rect.x + 30,
            rect.y + 10,
            rect.width - 36,
            "right",
          );
          this.resetFontSettings();
        }
        this.resetTextColor();
      },
    );
  } else {
    console.warn(
      `[${PLUGIN_NAME}] Window_ShopItemList not found; shop layout hook skipped`,
    );
  }

  // ---------------------------------------------------------------------------
  // Layer 4: windowHooks — LL inquiry prompts (XdRs_LL_Windows)
  // ---------------------------------------------------------------------------

  if (typeof LL_InquiryItem !== "undefined") {
    aliasMethod(LL_InquiryItem.prototype, "drawTips", function (origin) {
      this.resetFontSettings();
      this.drawText(applyTextMap("是否确认使用物品？"), 0, 172, 546, "center");
    });
  }

  if (typeof LL_InquirySkill !== "undefined") {
    aliasMethod(LL_InquirySkill.prototype, "drawTips", function (origin) {
      this.resetFontSettings();
      this.drawText(applyTextMap("是否确认使用技能？"), 0, 172, 546, "center");
    });
  }

  if (typeof LL_MenuEquipList !== "undefined") {
    aliasMethod(
      LL_MenuEquipList.prototype,
      "drawItem",
      function (origin, index) {
        const item = this.items()[index];
        const rect = this.itemRect(index);
        if (item) {
          this._itemContents.drawItemName(
            item,
            rect.x + 10,
            rect.y + 3,
            rect.width - 20,
          );
          this._itemContents.drawText(
            $gameParty.numItems(item),
            rect.x + 10,
            rect.y + 3,
            rect.width - 50,
            "right",
          );
        } else {
          this._itemContents.drawText(
            applyTextMap("卸下"),
            rect.x + 10,
            rect.y + 3,
            rect.width - 50,
            "center",
          );
        }
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Layer 5: Cat_NewWindow — composed strings & context-specific labels
  // ---------------------------------------------------------------------------

  if (typeof Window_MenuTime !== "undefined") {
    aliasMethod(Window_MenuTime.prototype, "drawTimeText", function (origin) {
      this.contents.clear();
      this.contents.fontSize = 18;
      const year = $gameVariables.value(FlyCat.LL_SceneMenu.yearVariable);
      const month = $gameVariables.value(FlyCat.LL_SceneMenu.monthVariable);
      if (SceneManager._scene instanceof Scene_Menu) {
        const weather = $gameSystem._menuWeather
          ? applyTextMap($gameSystem._menuWeather)
          : "None";
        this.drawText("Thời đại bất tử", 0, 0, this.width - 20, "center");
        this.drawText(
          "Năm " + year + " Tháng " + month,
          0,
          36,
          this.width - 20,
          "center",
        );
        this.drawText("Mùa: " + weather, 0, 72, this.width - 20, "center");
      } else {
        const weather = $gameSystem._menuWeather
          ? applyTextMap($gameSystem._menuWeather)
          : applyTextMap("春");
        this.changeTextColor("#462a39");
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        this.drawText(
          applyTextMap("修仙纪元"),
          0,
          6,
          this.width - 44,
          "center",
        );
        this.drawText("Năm " + year, 0, 32, this.width - 44, "center");
        this.drawText(
          "Tháng " + month + " (Mùa " + weather + ")",
          5,
          58,
          this.width - 44,
          "center",
        );
      }
    });
  }

  if (typeof Window_MenuHpMp !== "undefined") {
    aliasMethod(Window_MenuHpMp.prototype, "refresh", function (origin) {
      this.contents.clear();
      const actor = this._actor;
      const width = this.width;
      this.changeTextColor("#462a39");
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
      const x = 10;
      const y = 10;
      if (SceneManager._scene instanceof Scene_Skill) {
        this.contents.fontSize = 20;
        this.drawText("HP：", x, y, width, "left");
        this.drawHmtepBitmap(x + 80, y + 7, actor.hp, actor.mhp, 1);
        this.drawText("MP：", x + 460, y, width, "left");
        this.drawHmtepBitmap(x + 80 + 460, y + 7, actor.mp, actor.mmp, 3);
      } else {
        this.contents.fontSize = 26;
        this.drawText("HP：", x, y, width, "left");
        this.drawHmtepBitmap(x + 80, y + 10, actor.hp, actor.mhp, 1);
        this.drawText("MP：", x + 460, y, width, "left");
        this.drawHmtepBitmap(x + 80 + 460, y + 10, actor.mp, actor.mmp, 3);
      }
    });
  }

  if (typeof Window_EquipItem !== "undefined") {
    aliasMethod(
      Window_EquipItem.prototype,
      "drawItemNumber",
      function (origin, item, x, y, width) {
        if (this.needsNumber()) {
          this.contents.fontSize = 12;
          this.drawText(
            "Sở hữu:",
            x + 10,
            y + 15,
            width - this.textWidth("0000"),
            "right",
          );
          this.drawText($gameParty.numItems(item), x, y + 15, width, "right");
        }
      },
    );

    aliasMethod(
      Window_EquipItem.prototype,
      "drawItem",
      function (origin, index) {
        const item = this.itemAt(index);
        if (item) {
          const numberWidth = this.numberWidth();
          const rect = this.itemLineRect(index);
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
          this.changeTextColor("#462a39");
          this.contents.fontSize = 14;
          this.drawCursorBitmap(rect);
          this.changePaintOpacity(this.isEnabled(item));
          this.drawItemName(item, rect.x + 26, rect.y + 4, rect.width);
          this.drawItemNumber(item, rect.x - 4, rect.y + 4, rect.width);
          this.changePaintOpacity(1);
        } else {
          const rect = this.itemLineRect(index);
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
          this.changeTextColor("#462a39");
          this.contents.fontSize = 14;
          this.drawCursorBitmap(rect);
          this.drawText(
            "【Tháo Trang Bị】",
            rect.x,
            rect.y + 4,
            rect.width,
            "center",
          );
        }
      },
    );

    aliasMethod(
      Window_EquipItem.prototype,
      "drawItemName",
      function (origin, item, x, y, width) {
        if (item) {
          const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
          const textMargin = ImageManager.iconWidth + 4;
          const itemWidth = Math.max(0, width - textMargin);
          this.resetTextColor();
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
          this.changeTextColor("#462a39");
          this.contents.fontSize = 14;
          this.drawIcon(item.iconIndex, x, iconY);
          this.drawText(item.name, x + textMargin, y, itemWidth);
        }
      },
    );
  }

  if (typeof Window_EquipStatus !== "undefined") {
    aliasMethod(
      Window_EquipStatus.prototype,
      "drawCurrentParam",
      function (origin, x, y, paramId, type) {
        const paramWidth = this.paramWidth();
        if (type == 0) {
          this.contents.fontSize = 22;
          const text = ["HP:", "MP:", "Nộ khí:", "EXP:"];
          this.drawText(text[paramId], 0, y, this.width, "left");
          this.contents.fontSize = 20;
          if (paramId < 2) {
            this.drawText(
              this._actor.param(paramId),
              x,
              y,
              paramWidth,
              "center",
            );
          } else {
            if (paramId == 2) var value = this._actor.tp;
            if (paramId == 3)
              var value =
                this._actor.currentExp() - this._actor.currentLevelExp();
            this.drawText(value, x, y, paramWidth, "center");
          }
        } else {
          const text = [
            "Công kích:",
            "Phòng ngự:",
            "Pháp công:",
            "Pháp phòng:",
            "Thân pháp:",
            "Ngộ tính:",
          ];
          this.contents.fontSize = 22;
          this.drawText(text[paramId - 2], 0, y, this.width, "left");
          this.contents.fontSize = 20;
          this.drawText(this._actor.param(paramId), x, y, paramWidth, "center");
        }
        this.drawText("→", x + 50, y, paramWidth, "center");
      },
    );
  }

  if (typeof Window_PetParam !== "undefined") {
    aliasMethod(Window_PetParam.prototype, "refresh", function (origin, pet) {
      this.contents.clear();
      this.changeTextColor("#462a39");
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
      this.contents.fontSize = 24;
      const actor = pet;
      let x = 0;
      let y = 0;
      const text = [
        "HP：",
        "Cấp：",
        "EXP：",
        "",
        "ATK：",
        "DEF：",
        "M.ATK：",
        "M.DEF：",
        "SPD：",
        "Bond：",
      ];
      for (let i = 0; i < 4; i++) {
        if (i % 2 == 1) {
          x = 200;
        } else {
          x = 0;
        }
        if (i < 2) {
          if (i == 0) {
            this.drawText(
              text[i] + actor.hp + "/" + actor.mhp,
              x,
              y,
              this.width,
              "left",
            );
          } else {
            this.drawText(text[i] + actor._level, x, y, this.width, "left");
          }
        } else {
          if (i == 2) {
            const nowExp = actor.currentExp() - actor.currentLevelExp();
            const maxExp = actor.nextLevelExp() - actor.currentLevelExp();
            var value = nowExp + "/" + maxExp;
          }
          if (i == 3) {
            var value = "";
          }
          this.drawText(text[i] + value, x, y, this.width, "left");
        }
        if (i % 2 == 1) {
          y += 40;
        }
      }
      for (let i = 0; i < 6; i++) {
        if (i % 2 == 1) {
          x = 200;
        } else {
          x = 0;
        }
        this.drawText(
          text[i + 4] + actor.param(i + 2),
          x,
          y,
          this.width,
          "left",
        );
        if (i % 2 == 1) {
          y += 40;
        }
      }
    });
  }

  if (typeof Window_Options !== "undefined") {
    aliasMethod(
      Window_Options.prototype,
      "addCommand",
      function (origin, name, symbol, enabled, ext) {
        if (symbol != "touchUI") {
          this._list.push({
            name: applyTextMap(name),
            symbol: symbol,
            enabled: enabled,
            ext: ext,
          });
        }
      },
    );

    aliasMethod(Window_Options.prototype, "drawItem", function (origin, index) {
      const title = this.commandName(index);
      const status = this.statusText(index);
      const rect = this.itemLineRect(index);
      const statusWidth = this.statusWidth();
      const titleWidth = rect.width - statusWidth;
      this.resetTextColor();
      this.drawCursorBitmap(rect);
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.changeTextColor("#462a39");
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
      this.contents.fontSize = 24;
      if (title != "Thoát game" && title != "Trở về") {
        this.drawText(title, rect.x + 36, rect.y + 6, titleWidth, "left");
        this.drawText(status, rect.x - 6, rect.y + 6, 370, "right");
      } else {
        this.drawText(title, rect.x, rect.y + 6, 360, "center");
      }
    });
  }

  if (typeof Window_MenuCommand !== "undefined") {
    aliasMethod(
      Window_MenuCommand.prototype,
      "drawItem",
      function (origin, index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.contents.fontSize = 16;
        this.changeTextColor("#462a39");
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        this.drawText(
          this.commandName(index),
          rect.x + 16,
          rect.y,
          rect.width,
          align,
        );
      },
    );
  }
  // ---------------------------------------------------------------------------
  // Layer 6: Cat_FinalSceneUi — layout + SM scene
  // ---------------------------------------------------------------------------

  if (typeof Window_MenuLLStatus !== "undefined") {
    aliasMethod(Window_MenuLLStatus.prototype, "refresh", function (origin) {
      if (
        SceneManager._scene instanceof Scene_Menu &&
        typeof this.textFillRect === "function"
      ) {
        this.contents.clear();
        this.contents.fontSize = 20;
        const actor = this._actor;
        const width = this.width;
        let x = 0;
        let y = -5;
        const textW = this.textWidth("体力值：");
        this.drawText("Tên: " + actor.name(), x, y, width, "left");
        this.drawText("Cấp: " + actor.level, x + 155, y, width, "left");
        const llLevelName = $gameSystem.LLlevelName(actor.level);
        this.changeTextColor(ColorManager.textColor(24));
        this.drawText("Cảnh giới: " + llLevelName, x + 230, y, width - x - 230, "left");
        y += 28;
        let nowHp = actor.hp;
        let maxHp = actor.mhp;
        this._valueColor = [2, 10, 15];
        this.changeTextColor(ColorManager.textColor(0));
        this.drawText("Sinh mệnh: ", x, y, width, "left");
        this.textFillRect(x, y, textW, nowHp, maxHp, 2);
        y += 30;
        let nowMp = actor.mp;
        let maxMp = actor.mmp;
        this._valueColor = [1, 4, 15];
        this.changeTextColor(ColorManager.textColor(0));
        this.drawText("Linh lực: ", x, y, width, "left");
        this.textFillRect(x, y, textW, nowMp, maxMp, 2);
        y += 30;
        let nowTp = actor.tp;
        const maxTp = 100;
        this._valueColor = [6, 14, 15];
        this.changeTextColor(ColorManager.textColor(0));
        this.drawText("Nộ khí: ", x, y, width, "left");
        this.textFillRect(x, y, textW, nowTp, maxTp, 2);
        y += 30;
        this._valueColor = [3, 24, 15];
        const nowExp = actor.currentExp() - actor.currentLevelExp();
        const maxExp = actor.nextLevelExp() - actor.currentLevelExp();
        this.drawText("Kinh nghiệm: ", x, y, width, "left");
        this.textFillRect(x, y, textW, nowExp, maxExp, 2);
        y += 40;
        this.contents.fillRect(0, y, width, 3, ColorManager.textColor(1));
        y += 7;
        let corruptValue = 0;
        if (FlyCat.LL_SceneMenu.corruptValue) {
          corruptValue = $gameVariables.value(FlyCat.LL_SceneMenu.corruptValue);
          const dl_1 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_1);
          const dl_2 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_2);
          if (corruptValue < 0) corruptValue = 0;
          if (corruptValue >= 99 && dl_1 == false) corruptValue = 99;
          if (corruptValue >= 500 && dl_2 == false) corruptValue = 500;
          if (corruptValue >= 1000) corruptValue = 1000;
        }
        this._valueColor = [2, 10, 15];
        this.changeTextColor(ColorManager.textColor(this._valueColor[0]));
        this.drawText("Đọa lạc: ", x, y, width, "left");
        this.textFillRect(x, y, textW, corruptValue, 1000, 1);
        let xmValue = 0;
        if (FlyCat.LL_SceneMenu.xmValue) {
          xmValue = $gameVariables.value(FlyCat.LL_SceneMenu.xmValue);
          if (xmValue < 0) xmValue = 0;
          if (xmValue >= 1000) xmValue = 1000;
        }
        y += 28;
        this._valueColor = [10, 18, 15];
        this.changeTextColor(ColorManager.textColor(this._valueColor[0]));
        this.drawText("Tâm ma: ", x, y, width, "left");
        this.textFillRect(x, y, textW, xmValue, 1000);
        y += 28;
        let sexValue = 0;
        if (FlyCat.LL_SceneMenu.sexValue) {
          sexValue = $gameVariables.value(FlyCat.LL_SceneMenu.sexValue);
          if (sexValue < 0) sexValue = 0;
          if (sexValue >= 1000) sexValue = 1000;
        }
        this.changeTextColor(ColorManager.textColor(27));
        this.drawText("Mị lực: " + sexValue, x, y, width, "left");
        let pregnancyValue = 0;
        if (FlyCat.LL_SceneMenu.pregnancyValue) {
          pregnancyValue = $gameVariables.value(
            FlyCat.LL_SceneMenu.pregnancyValue,
          );
          if (pregnancyValue < 0) {
            pregnancyValue = 0;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 0);
          }
          if (pregnancyValue > 99) {
            pregnancyValue = 100;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 100);
          }
        }
        this.changeTextColor(ColorManager.textColor(17));
        this.drawText(
          "Mang thai: " + pregnancyValue,
          x + 140,
          y,
          width,
          "left",
        );
        this.changeTextColor(ColorManager.textColor(0));
        let text = " ";
        let text1 = " ";
        let text2 = " ";
        if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) text = "Bạch trọc ";
        if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) text1 = "Phát tình ";
        if ($gameSwitches.value(FlyCat.LL_SceneMenu.kzSwitch)) text2 = "Khống chế ";
        this.drawText(
          "Trạng thái: " + text + text1 + text2,
          x + 260,
          y,
          width,
          "left",
        );
        y += 30;
        let goldItemNumber = 0;
        if (FlyCat.LL_SceneMenu.goldItem) {
          const goldItem = $dataItems[FlyCat.LL_SceneMenu.goldItem];
          goldItemNumber = $gameParty.numItems(goldItem);
        }
        this.changeTextColor(ColorManager.textColor(12));
        this.drawText("Linh thạch: " + goldItemNumber, x, y, width, "left");
        this.changeTextColor(ColorManager.textColor(0));
        this.changeTextColor(ColorManager.textColor(14));
        this.drawText("Bạc: " + $gameParty.gold(), x + 200, y, width, "left");
        y += 30;
        const reputationText = $gameSystem._menuReputationText || "Không";
        this.changeTextColor(ColorManager.textColor(3));
        this.drawText("Thanh danh: " + reputationText, x, y, width, "left");
        const remarkText = $gameSystem._menuRemarkText || "Không";
        this.changeTextColor(ColorManager.textColor(14));
        this.drawText("Đánh giá: " + remarkText, x + 200, y, width, "left");
        y += 30;
        this.changeTextColor(ColorManager.textColor(27));
        const name = $gameSystem._menuTearPeopleName || "Trinh tiết";
        this.drawText("Lần đầu: " + name, x, y, width, "left");
        return;
      }

      if (!(SceneManager._scene instanceof Scene_Status)) {
        return origin.call(this);
      }

      this.contents.clear();
      const actor = this._actor;
      const width = this.width;
      this.changeTextColor("#462a39");
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
      let x = 10;
      this.contents.fontSize = 20;
      let y = 0;
      this.drawText("Tên：" + actor.name(), x, y, 185, "left");
      this.contents.fontSize = 26;
      this.drawText("Cấp：" + actor.level, x + 200, y, width, "left");
      const llLevelName = $gameSystem.LLlevelName(actor.level);
      y += 36;
      this.contents.fontSize = 18;
      this.contents.clearRect(0, y - 8, this.contentsWidth(), 40);
      this.changeTextColor("#462a39");
      this.drawText("Tu vi：" + applyTextMap(llLevelName), x, y, width, "left");
      this.contents.fontSize = 22;
      y += 38;
      this.drawText("HP：", x, y + 3, 115, "left");
      this.drawHmtepBitmap(x + 120, y + 12, actor.hp, actor.mhp, 1);
      y += 28;
      this.drawText("MP：", x, y + 3, 115, "left");
      this.drawHmtepBitmap(x + 120, y + 12, actor.mp, actor.mmp, 3);
      y += 28;
      this.drawText("Nộ khí：", x, y + 3, 115, "left");
      this.drawHmtepBitmap(x + 120, y + 12, actor.tp, 100, 5);
      y += 28;
      this.drawText("Kinh nghiệm：", x, y + 3, 115, "left");
      const nowExp = actor.currentExp() - actor.currentLevelExp();
      const maxExp = actor.nextLevelExp() - actor.currentLevelExp();
      this.drawHmtepBitmap(x + 120, y + 12, nowExp, maxExp, 7);
      y += 30;
      let corruptValue = FlyCat.LL_SceneMenu.corruptValue
        ? $gameVariables.value(FlyCat.LL_SceneMenu.corruptValue)
        : 0;
      const dl_1 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_1);
      const dl_2 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_2);
      const dl_3 = $gameSwitches.value(Cat.NewSceneMenu.dlSwitchId_3);
      const dl_4 = $gameSwitches.value(Cat.NewSceneMenu.dlSwitchId_4);
      if (corruptValue < 0) corruptValue = 0;
      if (corruptValue >= 99 && dl_1 == false) corruptValue = 99;
      if (corruptValue >= 500 && dl_2 == false) corruptValue = 500;
      if (corruptValue >= 1000 && dl_3 == false) corruptValue = 1000;
      if (corruptValue >= 1500 && dl_4 == false) corruptValue = 1500;
      $gameVariables.setValue(FlyCat.LL_SceneMenu.corruptValue, corruptValue);
      let maxValue;
      if (corruptValue <= 99 && dl_1 == false) maxValue = 99;
      else if (corruptValue <= 500 && dl_2 == false) maxValue = 500;
      else if (corruptValue <= 1000 && dl_3 == false) maxValue = 1000;
      else if (corruptValue <= 1500 && dl_4 == false) maxValue = 1500;
      else maxValue = 2000;
      this.contents.fontSize = 16;
      x = 24;
      this.drawText("Đọa lạc：", x, y, width, "left");
      this.drawHmtepBitmap(x + 100, y + 10, corruptValue, maxValue, 9);
      y += 28;
      let xmValue = 0;
      if (FlyCat.LL_SceneMenu.xmValue) {
        xmValue = $gameVariables.value(FlyCat.LL_SceneMenu.xmValue);
        if (xmValue < 0) xmValue = 0;
        if (xmValue >= 1000) xmValue = 1000;
      }
      $gameVariables.setValue(FlyCat.LL_SceneMenu.xmValue, xmValue);
      this.contents.fontSize = 16;
      this.drawText("Tâm ma：", x, y, width, "left");
      this.drawHmtepBitmap(x + 100, y + 10, xmValue, 1000, 11);
      this.contents.fontSize = 18;
      y += 28;
      let gongdeVariable = 0;
      if (FlyCat.LL_SceneMenu.gongdeVariable) {
        gongdeVariable = $gameVariables.value(
          FlyCat.LL_SceneMenu.gongdeVariable,
        );
        if (gongdeVariable < 0) {
          gongdeVariable = 0;
          $gameVariables.setValue(FlyCat.LL_SceneMenu.gongdeVariable, 0);
        } else if (gongdeVariable > 9999) {
          gongdeVariable = 9999;
          $gameVariables.setValue(FlyCat.LL_SceneMenu.gongdeVariable, 9999);
        }
      }
      this.contents.fontSize = 16;
      this.drawText("Công Đức: " + gongdeVariable, x, y, width, "left");
      let jingqiVariable = 0;
      if (FlyCat.LL_SceneMenu.jingqiVariable) {
        jingqiVariable = $gameVariables.value(
          FlyCat.LL_SceneMenu.jingqiVariable,
        );
        if (jingqiVariable < 0) {
          jingqiVariable = 0;
          $gameVariables.setValue(FlyCat.LL_SceneMenu.jingqiVariable, 0);
        }
        if (jingqiVariable > 999) {
          jingqiVariable = 1000;
          $gameVariables.setValue(FlyCat.LL_SceneMenu.jingqiVariable, 1000);
        }
      }
      this.contents.fontSize = 16;
      this.drawText(
        "Tinh Khí: " + jingqiVariable,
        x + 110,
        y,
        width,
        "left",
      );
      let pregnancyValue = 0;
      if (FlyCat.LL_SceneMenu.pregnancyValue) {
        pregnancyValue = $gameVariables.value(
          FlyCat.LL_SceneMenu.pregnancyValue,
        );
        if (pregnancyValue < 0) {
          pregnancyValue = 0;
          $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 0);
        }
        if (pregnancyValue > 99) {
          pregnancyValue = 100;
          $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 100);
        }
      }
      this.drawText("Độ Thụ Thai: " + pregnancyValue, x + 220, y, width, "left");
      let name;
      if (!$gameSwitches.value(15) && $gameSystem._menuTearPeopleName) {
        name = $gameSystem._menuTearPeopleName;
      } else {
        name = "Chưa phá Nguyên Âm";
      }
      y += 28;
      this.drawText("Người phá Nguyên Âm: " + name, x, y, width, "left");
      y += 28;
      const reputationText = $gameSystem._menuReputationText || "Không có";
      const syValue = "(" + $gameVariables.value(13) + ")";
      this.drawText(
        "Danh Vọng: " + reputationText + syValue,
        x,
        y,
        width,
        "left",
      );
      y += 28;
      const remarkText = $gameSystem._menuRemarkText || "Không có";
      this.drawText("Danh Tiếng: " + remarkText, x, y, width, "left");
      y += 36;
      this.drawText("Trạng thái", x + 104, y, width, "left");
      y += 32;
      for (let i = 0; i < actor.states().length; i++) {
        if (actor.states()[i]) {
          if (i % 2 == 1) x = 192;
          else x = 10;
          const state = actor.states()[i];
          this.drawText(state.name, x, y, width, "left");
          if (i % 2 == 1) y += 28;
        }
      }
    });
  }

  if (typeof Window_MenuLLStatus !== "undefined") {
    aliasMethod(
      Window_MenuLLStatus.prototype,
      "drawText",
      function (origin, text, x, y, maxWidth, align) {
        if (text.startsWith("姓名：") || text.startsWith("Name:") || text.startsWith("Name：") || text.startsWith("Tên：")) {
          return origin.call(this, text, x, y, 185, align);
        }
        if (text.startsWith("等级：") || text.startsWith("Level:") || text.startsWith("Level：") || text.startsWith("Cấp：")) {
          return origin.call(this, text, x, y, maxWidth, align);
        }
        return origin.call(this, text, x, y, maxWidth, align);
      }
    );
  }

  if (typeof Window_SmInfo !== "undefined") {
    aliasMethod(
      Window_SmInfo.prototype,
      "resetFontSettings",
      function (origin) {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 15;
        this.resetTextColor();
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        this.changeTextColor("#462a39");
      },
    );

    Window_SmInfo.prototype.wrapTextEx = function (text, maxWidth) {
      // Split by newlines first, then process each line
      const paragraphs = text.split("\n");
      this.resetFontSettings();
      let finalLine = "";
      let linecount = 0;

      for (let p = 0; p < paragraphs.length; p++) {
        if (p > 0) {
          finalLine += "\n";
          linecount++;
        }

        const words = paragraphs[p].split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let word = words[i];
          let testLine = currentLine + (currentLine ? " " : "") + word;
          let testWidth = this.textSizeEx(testLine).width;

          if (testWidth > maxWidth && currentLine !== "") {
            finalLine += currentLine + "\n";
            linecount++;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        finalLine += currentLine;
        if (currentLine) linecount++;
      }

      return {
        text: finalLine,
        lines: linecount,
      };
    };

    aliasMethod(Window_SmInfo.prototype, "refresh", function (origin) {
      this.contents.clear();
      this.contents.fontSize = 20; //字体大小
      const zText = Cat.SmCore.zText;
      const nText = Cat.SmCore.nText;
      const pText = Cat.SmCore.pText;
      const xText = Cat.SmCore.xText;
      const mouthValue = $gameVariables.value(Cat.SmCore.mouthValue);
      const thoraxValue = $gameVariables.value(Cat.SmCore.thoraxValue);
      const vaginaValue = $gameVariables.value(Cat.SmCore.vaginaValue);
      const bunsValue = $gameVariables.value(Cat.SmCore.bunsValue);
      var x = 0;
      var y = 0;
      var ofy = 32;
      var ofx = 210;
      if (mouthValue <= 100) {
        var info = zText[0];
      } else if (mouthValue > 100 && mouthValue <= 300) {
        var info = zText[1];
      } else if (mouthValue > 300 && mouthValue <= 600) {
        var info = zText[2];
      } else if (mouthValue > 600 && mouthValue <= 1000) {
        var info = zText[3];
      } else {
        var info = zText[4];
      }
      const mouthText = this.wrapTextEx(applyTextMap("Miệng: " + info), this.width-100);
      this.drawTextEx(mouthText.text, x, y, this.width, "left");
      y += mouthText.lines * ofy;
      if (thoraxValue <= 100) {
        var info = nText[0];
      } else if (thoraxValue > 100 && thoraxValue <= 300) {
        var info = nText[1];
      } else if (thoraxValue > 300 && thoraxValue <= 600) {
        var info = nText[2];
      } else if (thoraxValue > 600 && thoraxValue <= 1000) {
        var info = nText[3];
      } else {
        var info = nText[4];
      }
      const thoraxText = this.wrapTextEx(applyTextMap("Ngực: " + info), this.width-100);
      this.drawTextEx(thoraxText.text, x, y, this.width, "left");
      y += thoraxText.lines * ofy;
      if (vaginaValue <= 100) {
        var info = xText[0];
      } else if (vaginaValue > 100 && vaginaValue <= 300) {
        var info = xText[1];
      } else if (vaginaValue > 300 && vaginaValue <= 600) {
        var info = xText[2];
      } else if (vaginaValue > 600 && vaginaValue <= 1000) {
        var info = xText[3];
      } else {
        var info = xText[4];
      }
      const vaginaText = this.wrapTextEx(applyTextMap("Âm đạo: " + info), this.width-100)
      this.drawTextEx(vaginaText.text, x, y, this.width, "left");
      y += vaginaText.lines * ofy;
      if (bunsValue <= 100) {
        var info = pText[0];
      } else if (bunsValue > 100 && bunsValue <= 300) {
        var info = pText[1];
      } else if (bunsValue > 300 && bunsValue <= 600) {
        var info = pText[2];
      } else if (bunsValue > 600 && bunsValue <= 1000) {
        var info = pText[3];
      } else {
        var info = pText[4];
      }
      const bunsText = this.wrapTextEx(applyTextMap("Hậu môn: " + info), this.width-100)
      this.drawTextEx(bunsText.text, x, y, this.width, "left");
      y += bunsText.lines * ofy;
      const text = [
        "Với nhân loại: ",
        "Với yêu thú: ",
        "Bị quấy rối: ",
        "Dùng đạo cụ: ",
        "Bị cưỡng hiếp: ",
        "Bị cưỡng hiếp tập thể: ",
        "Dụ dỗ: ",
        "Cưỡng ép: ",
        "Qua đường miệng: ",
        "Dùng ngực: ",
        "Qua đường hậu môn: ",
      ];
      this.drawTextEx(
        text[0] + $gameVariables.value(Cat.SmCore.value_1),
        x,
        y,
        this.width,
      );
      //var x = ofx;
      y += ofy;
      this.drawTextEx(
        text[1] + $gameVariables.value(Cat.SmCore.value_2),
        x,
        y,
        this.width,
      );
      y += ofy;
      var x = 0;
      this.drawTextEx(
        text[4] + $gameVariables.value(Cat.SmCore.value_5),
        x,
        y,
        this.width,
      );
      y += ofy;
      this.drawTextEx(
        text[5] + $gameVariables.value(Cat.SmCore.value_6),
        x,
        y,
        this.width,
      );
      y += ofy;
      this.drawTextEx(
        text[2] + $gameVariables.value(Cat.SmCore.value_3),
        0,
        y,
        this.width,
      );
      this.drawTextEx(
        text[3] + $gameVariables.value(Cat.SmCore.value_4),
        120,
        y,
        this.width,
      );
      y += ofy;
      this.drawTextEx(
        text[6] + $gameVariables.value(Cat.SmCore.value_7),
        0,
        y,
        this.width,
      );
      this.drawTextEx(
        text[7] + $gameVariables.value(Cat.SmCore.value_8),
        120,
        y,
        this.width,
      );
      y += ofy;
      this.drawTextEx(
        text[8] + $gameVariables.value(Cat.SmCore.value_9),
        0,
        y,
        this.width,
      );
      y += ofy;
      this.drawTextEx(
        text[10] + $gameVariables.value(Cat.SmCore.value_11),
        0,
        y,
        this.width,
      );
      y += ofy;
      this.drawTextEx(
        text[9] + $gameVariables.value(Cat.SmCore.value_10),
        0,
        y,
        this.width,
      );
    });
  }

  if (typeof Window_NewSkillList !== "undefined") {
    aliasMethod(
      Window_NewSkillList.prototype,
      "_updateCursor",
      function (origin) {
        this._cursorSprite.alpha = 0;
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
        if (this.index() >= 0 && this.active) {
          this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
          this._cursorSprites.x = this._cursorSprite.x - 9;
          this._cursorSprites.y = this._cursorSprite.y + 12;
        } else {
          this._cursorSprites.visible = false;
        }
      },
    );
  }

  if (typeof Window_NpcTypeListCommand !== "undefined") {
    aliasMethod(
      Window_NpcTypeListCommand.prototype,
      "refresh",
      function (origin) {
        this.createContents();
        this._list = ["Thường", "Đạo lữ", "Bạn bè", "Kẻ thù"];
        this.drawAllItems();
      },
    );
  }

  if (typeof Window_ActorCommand !== "undefined") {
    aliasMethod(
      Window_ActorCommand.prototype,
      "drawItem",
      function (origin, index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.changeTextColor(ColorManager.textColor(0));
        this.contents.fontSize = index == 1 ? 16 : 22;
        this.drawText(
          this.commandName(index),
          rect.x,
          rect.y,
          rect.width,
          align,
        );
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Layer 7: FlyCat_LL_SceneMenu — quest panel & corruption tier labels
  // ---------------------------------------------------------------------------

  if (typeof Window_ZxQuest !== "undefined") {
    aliasMethod(Window_ZxQuest.prototype, "refresh", function (origin) {
      this.contents.clear();
      const id = $gameSystem._zxQuest || 0;
      const x = 0;
      const y = 0;
      const width = this.width;
      const height = this.height;
      this.contents.fontSize = 20;
      if (id > 0) {
        const quest = eval(FlyCat.LL_SceneMenu.zxQuest[id - 1]);
        this.drawTextEx(quest, x, y, width);
      } else {
        this.drawText(
          applyTextMap("Chưa nhận nhiệm vụ chính tuyến!"),
          x,
          y + height / 2 - 24,
          width,
          "center",
        );
      }
    });
  }

  if (typeof Window_MenuLLStatus !== "undefined") {
    aliasMethod(
      Window_MenuLLStatus.prototype,
      "textFillRect",
      function (origin, x, y, textW, value, value1, jd) {
        let text = "";
        let cd = 350;
        if (jd == 1) {
          if (value <= 99) text = applyTextMap(" (Nhất giai)");
          if (value > 99) text = applyTextMap(" (Nhị giai)");
          if (value > 500) text = applyTextMap(" (Tam giai)");
        }
        if (jd == 2) cd = 350;
        this.contents.fillRect(
          x + textW,
          y + 8,
          cd,
          20,
          ColorManager.textColor(this._valueColor[0]),
        );
        this.contents.fillRect(
          x + textW,
          y + 8,
          (value / value1) * cd,
          20,
          ColorManager.textColor(this._valueColor[1]),
        );
        this.changeTextColor(ColorManager.textColor(this._valueColor[2]));
        this.contents.outlineWidth = 0;
        this.drawText(value + text, x + textW, y, cd, "center");
        this.resetTextColor();
        this.contents.outlineWidth = 3;
      },
    );
  }

  if (typeof Sprite_SmText !== undefined) {
    aliasMethod(Sprite_SmText.prototype, "update", function (origin) {
      Sprite.prototype.update.call(this);
      if (
        this._id > 0 &&
        this.bitmap &&
        this.bitmap.isReady() &&
        !this._complete
      ) {
        const text = ["", "Nhất Giai", "Nhị Giai", "Tam Giai", "Tứ Giai", "Ngũ Giai"];
        this.bitmap.drawText(
          applyTextMap(text[this._level]),
          0,
          0,
          144,
          33,
          "center",
        );
        this._complete = true;
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Layer 8: FlyCat_AutoLookNpc — Top left information window
  // ---------------------------------------------------------------------------

  const Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    Scene_Map_createAllWindows.call(this);
    if (localStorage.getItem("GameLanguage")) {
      const data = JSON.parse(localStorage.getItem("GameLanguage"));
      if (data) {
        var img = data.dataName;
      } else {
        var img = "";
      }
    } else {
      var img = "";
    }
    this._timeSprite.bitmap = ImageManager.loadPicture("time" + img);
  };

  aliasMethod(Scene_Map.prototype, "timeWindowRect", function (origin) {
    const ww = 500;
    const wh = 200;
    const wx = 10;
    const wy = 6;
    return new Rectangle(wx, wy, ww, wh);
  });

  if (typeof Window_LookNpc !== "undefined") {
    aliasMethod(
      Window_LookNpc.prototype,
      "initialize",
      function (origin, rect) {
        rect.width += 100;
        rect.x -= 100;
        Window_Selectable.prototype.initialize.call(this, rect);
        this.opacity = 255;
        this.refresh();
      },
    );

    aliasMethod(Window_LookNpc.prototype, "refresh", function (origin) {
      this._list = [];
      const events = $dataMap.events;
      $we.saveActiveEvents();
      let maxNameWidth = 0;

      for (let i = 1; i < events.length; i++) {
        var dv = events[i];
        if (dv && dv.meta.npc && this.lockEvents(i)) {
          if ($we.saveEvents[dv.id]) {
            this._list.push(dv);
            // Measure the width of this name
            const nameWidth = this.contents.measureTextWidth(dv.name);
            if (nameWidth > maxNameWidth) {
              maxNameWidth = nameWidth;
            }
          }
        }
      }

      // Set width to maximum name width plus padding (adjust padding as needed)
      const padding = this.padding * 2; // Standard window padding on both sides
      this.width = maxNameWidth + padding + 40; // Extra 40 for margins/spacing
      this.createContents();
      this.drawAllItems();
    });
  }

  if (typeof Window_TitleTimeWindow !== "undefined") {
    aliasMethod(Window_TitleTimeWindow.prototype, "refresh", function (origin) {
      this.contents.clear();
      // const date = new Date();
      // const hour = date.getHours();
      // const min = date.getMinutes();
      // const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      const year = $gameVariables.value(FlyCat.LL_SceneMenu.yearVariable);
      const month = $gameVariables.value(FlyCat.LL_SceneMenu.monthVariable);
      const weather = $gameSystem._menuWeather ? $gameSystem._menuWeather : "";
      this.contents.fontSize = 20;
      this.contents.outlineWidth = 3;
      this.contents.outlineColor = ColorManager.textColor(15);
      this.changeTextColor(ColorManager.textColor(0));
      const weatherVi = weather ? applyTextMap(weather) : applyTextMap("春");
      this.drawText(
        "Năm " + year + " Tháng " + month + " Mùa " + weatherVi,
        0,
        0,
        300,
        "left",
      );
      //   this.drawText("时间：" + hour + ':' + min + ':' + ss, 0, 0, 300, 'left')
      const x = $gamePlayer.x;
      const y = $gamePlayer.y;
      this.contents.fontSize = 16;
      this.drawText("Tọa độ: " + x + "," + y, 0, 30, 300, "left");
      this.drawText("Vị trí: " + $gameMap.displayName(), 0, 60, 300, "left");
    });
  }
  // ---------------------------------------------------------------------------
  // Layer 9: XdRs_AutomaticSpeaking — NPC talking window when close
  // ---------------------------------------------------------------------------
  if (typeof Window_AutomaticSpeaking !== undefined) {
    aliasMethod(
      Window_AutomaticSpeaking.prototype,
      "initialize",
      function (origin, text, objSprite) {
        text = this.analysisNote(text);
        this.callSuperInitialize(0, 0, 32, 32);
        this._objSprite = objSprite;
        this.resetWindow(text);
        text = text.replace(/RE/, "");
        this.drawTextEx(this.wrapText(text, Graphics.boxWidth / 2), 0, 0);
        this.pause = true;
        this.z = 9;
        this.hide();
      },
    );

    aliasMethod(
      Window_AutomaticSpeaking.prototype,
      "resetWindow",
      function (origin, text) {
        // Wrap text to half screen width first
        text = this.wrapText(text, Graphics.boxWidth / 2);
        var data = this.getTextSizeExData(text);
        this.width = data.width + this._padding * 2;
        this.height = data.height + this._padding * 2;
        this.createContents();
        var sprite = XdRsData.as.isMz()
          ? this._pauseSignSprite
          : this._windowPauseSignSprite;
        sprite && sprite.move(this.width / 2, this.height + 24);
      },
    );

    Window_AutomaticSpeaking.prototype.wrapText = function (text, maxWidth) {
      if (!text) return "";

      // Preserve original newlines
      const paragraphs = text.split("\n");
      this.resetFontSettings();
      let finalText = "";

      for (let p = 0; p < paragraphs.length; p++) {
        if (p > 0) finalText += "\n";

        const words = paragraphs[p].split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let testLine = currentLine + (currentLine ? " " : "") + words[i];
          let testWidth = this.textSizeEx(testLine).width;

          if (testWidth > maxWidth && currentLine !== "") {
            finalText += currentLine + "\n";
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        finalText += currentLine;
      }

      return finalText;
    };
  }

  // ---------------------------------------------------------------------------
  // Layer 9: Cat_MessageWindow — NPC talking window (qp)
  // ---------------------------------------------------------------------------

  aliasMethod(
    Window_Message.prototype,
    "newCatMessageWindow",
    function (origin) {
      if ($gameMessage.getQpFaceSprite()) {
        // 1. Set the bubble width first[cite: 2]
        this.width = $gameMessage._catFaceMessageWidth;

        // 2. Lookahead: Calculate lines BEFORE createContents
        const maxWidth = this.width - this.phileasGetWindowMessageMargin();
        const expandedText = this.convertEscapeCharacters(
          $gameMessage.allText(),
        );

        // Use the globally exposed function from Phileas[cite: 1]
        let actualLineCount = 1;
        if (typeof window.phileasGetWrappedText === "function") {
          const tempWrapped = window
            .phileasGetWrappedText(expandedText, maxWidth, this, 4)
            .split("\n");
          actualLineCount = Math.min(Math.max(tempWrapped.length, 1), 4);
        }

        // 3. Set the TRUE height and initialize the canvas ONCE[cite: 2]
        this.height = this.fittingHeight(actualLineCount);
        this.createContents();
      } else {
        const rect = this._baseRect;
        if (this.width !== rect.width || this.height !== rect.height) {
          this.width = rect.width;
          this.height = rect.height;
          this.x = rect.x;
          this.createContents();
        }
      }
    },
  );

  const CNTL_convertEscapeCharacters =
    Window_Message.prototype.convertEscapeCharacters;
  aliasMethod(
    Window_Message.prototype,
    "convertEscapeCharacters",
    function (origin, text) {
      if (!$gameMessage.getQpFaceSprite()) {
        return CNTL_convertEscapeCharacters.call(this, text);
      } else {
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
          $gameVariables.value(parseInt(p1)),
        );
        text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
          this.actorName(parseInt(p1)),
        );
        text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
          this.partyMemberName(parseInt(p1)),
        );
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
      }
    },
  );

  // ---------------------------------------------------------------------------
  // Layer 10: drawText  & drawTextEx
  // ---------------------------------------------------------------------------

  aliasMethod(
    Bitmap.prototype,
    "drawText",
    function (origin, text, x, y, maxWidth, lineHeight, align) {
      // [Note] Different browser makes different rendering with
      //   textBaseline == 'top'. So we use 'alphabetic' here.
      const context = this.context;
      const alpha = context.globalAlpha;
      maxWidth = maxWidth || 0xffffffff;
      let tx = x;
      let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
      if (align === "center") {
        tx += maxWidth / 2;
      }
      if (align === "right") {
        tx += maxWidth;
      }
      context.save();
      context.font = this._makeFontNameText();
      context.textAlign = align;
      context.textBaseline = "alphabetic";
      context.globalAlpha = 1;
      this._drawTextOutline(applyTextMap(text), tx, ty, maxWidth);
      context.globalAlpha = alpha;
      this._drawTextBody(applyTextMap(text), tx, ty, maxWidth);
      context.restore();
      this._baseTexture.update();
    },
  );

  aliasMethod(
    Window_Base.prototype,
    "drawTextEx",
    function (origin, text, x, y, width) {
      this.resetFontSettings();

      const textState = this.createTextState(applyTextMap(text), x, y, width);
      this.processAllText(textState);
      return textState.outputWidth;
    },
  );

  // ---------------------------------------------------------------------------
  // Layer 11: Menu Layouts
  // ---------------------------------------------------------------------------

  if (typeof Sprite_ShopButton !== "undefined") {
    Sprite_ShopButton.prototype.loadButtonImage = function () {
      this.bitmap = ImageManager.loadBitmap("img/shopUi/", "ButtonSet-en");
    };
  }

  Game_System.prototype.playLetterNpcMessage = function (
    message,
    item,
    type,
    img,
    max,
    scaleX,
    scaleY,
  ) {
    var htime = new Date();
    var hour = htime.getHours(); //时
    var min = htime.getMinutes(); //分
    var ss = htime.getSeconds(); //秒
    SoundManager.playLetterSe("Bell3"); //播放音效
    var text = "";
    if (ss < 10) var text = "0";
    var time = ""; //hour + ':' + min + ':' + text + ss;
    if (type == 1) {
      item.letterText.push("\\C[0]" + time + " " + item.name + ":  " + message);
      SceneManager._scene._infoWindow.refresh(item);
    } else if (type == -1) {
      item.letterText.push(
        "\\C[0]" + time + " " + item.name + ":  \\C[14]" + message,
      );
      if (img) {
        if (max) {
          var maxText = " " + max;
        } else {
          var maxText = " " + 3;
        }
        if (!scaleX) {
          var scaleX = " " + 1;
        } else {
          var scaleX = " " + scaleX;
        }
        if (!scaleY) {
          var scaleY = " " + 1;
        } else {
          var scaleY = " " + scaleY;
        }
        item.letterText.push("img " + img + maxText + scaleX + scaleY);
      }
    } else {
      item.letterText.push("\\C[0]" + time + "\\C[3]" + "  " + message);
      message = message.slice(2);
      item.letterText.push(
        "\\C[0]" +
          time +
          " " +
          item.name +
          ":  " +
          $gameSystem.LetterNpcHd(message, item),
      );
      SceneManager._scene._infoWindow.refresh(item);
    }
  };

  if (typeof Scene_MenuBase !== "undefined") {
    aliasMethod(
      Scene_MenuBase.prototype,
      "createBackground",
      function (origin) {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);

        if (SceneManager._scene instanceof Scene_Title) {
        } else if (SceneManager._scene instanceof Scene_Options) {
          // this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
          // this._backgroundSprite.filters = [];
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/options/",
            "menuBack",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_Status) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/menu/",
            "menuBack-en",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_Item) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/item/",
            "menuBack2",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_File) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/save/",
            "menuBack-en",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_Equip) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/equip/",
            "menuBack",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_Quest) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/quest/",
            "menuBack",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_Skill) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/skill/",
            "menuBack",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_LetterNpc) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/cy/",
            "menuBack",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_LL_Pet) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/lc/",
            "menuBack",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_GameEnd) {
          this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
          this._backgroundSprite.filters = [];
          Scene_Gameover;
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/menu/",
            "gameOverBack",
          );
          this.addChild(this._backgroundSprite_new);
        } else if (SceneManager._scene instanceof Scene_SM) {
          this._backgroundSprite_new = new Sprite();
          this._backgroundSprite_new.bitmap = ImageManager.loadBitmap(
            "img/newUi/sm/",
            "menuBack",
          );
          this.addChild(this._backgroundSprite_new);
        }
      },
    );
  }

  aliasMethod(
    Window_EquipSlot.prototype,
    "drawItem",
    function (origin, index, index_1) {
      if (this._actor) {
        const slotName = this.actorSlotName(this._actor, index);
        const item = this.itemAt(index);
        const slotNameWidth = this.slotNameWidth();
        if (index_1 == 1) {
          var index = 0;
        }
        const rect = this.itemLineRect(index);
        const itemWidth = rect.width - slotNameWidth;
        //  this.changeTextColor(ColorManager.systemColor());
        this.contents.outlineColor = "#ed8ceb";
        this.contents.outlineWidth = 1;
        this.changeTextColor("#462a39");
        this.contents.fontSize = 20;
        this.drawText(
          slotName,
          rect.x,
          rect.y - 25,
          slotNameWidth,
          rect.height,
        );
        this.drawItemName(item, rect.x, rect.y + 2, rect.width);
        this.changePaintOpacity(true);
      }
    },
  );

  if (typeof Window_NewEquipHelp !== "undefined") {
    aliasMethod(Window_NewEquipHelp.prototype, "refresh", function (origin) {
      const rect = this.baseTextRect();
      this.contents.clear();
      this.drawTextEx(
        this.wrapTextEx(this._text, rect.width),
        rect.x,
        rect.y,
        rect.width,
      );
    });

    aliasMethod(
      Window_NewEquipHelp.prototype,
      "initialize",
      function (origin, rect) {
        rect.height += 200;
        Window_Help.prototype.initialize.call(this, rect);
        this.windowskin = ImageManager.loadSystem("Window20");
        this.opacity = 0;
      },
    );
  }

  if (typeof Window_NewSkillHelp !== "undefined") {
    Window_NewSkillHelp.prototype.initialize = function (rect) {
      rect.height += 200;
      Window_Help.prototype.initialize.call(this, rect);
      this.windowskin = ImageManager.loadSystem("Window20");
      this.opacity = 0;
    };
    aliasMethod(Window_NewSkillHelp.prototype, "refresh", function () {
      const rect = this.baseTextRect();
      this.contents.clear();
      this.drawTextEx(
        this.wrapTextEx(this._text, rect.width),
        rect.x,
        rect.y,
        rect.width,
      );
    });

    aliasMethod(
      Window_NewSkillType.prototype,
      "drawItem",
      function (origin, index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        if (index == this.index()) {
          this.drawCursorBitmap(rect, 0);
        } else {
          this.drawCursorBitmap(rect, 1);
        }
        if (index == 2) rect.x += 20;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.contents.fontSize = 22;
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        this.changeTextColor("#462a39");
        this.drawText(
          this.commandName(index),
          rect.x,
          rect.y - 2,
          rect.width,
          align,
        );
      },
    );

    aliasMethod(
      Window_NewSkillType.prototype,
      "_updateCursor",
      function (origin) {
        this._cursorSprite.alpha = 0;
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
        if (this.index() >= 0) {
          //    this._cursorSprites.alpha = this._makeCursorAlpha();;
          this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
          this._cursorSprites.x = this._cursorSprite.x;
          this._cursorSprites.y = this._cursorSprite.y + 16;
        } else {
          this._cursorSprites.visible = false;
        }
      },
    );
  }

  if (typeof Window_QuestInfo !== "undefined") {
    aliasMethod(
      Window_QuestInfo.prototype,
      "resetFontSettings",
      function (origin) {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 18;
        this.resetTextColor();
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        this.changeTextColor("#462a39");
      },
    );

    Window_QuestInfo.prototype.wrapTextEx = function (text, maxWidth) {
      // Split by newlines first, then process each line
      const paragraphs = text.split("\n");
      this.resetFontSettings();
      let finalLine = "";
      let linecount = 0;

      for (let p = 0; p < paragraphs.length; p++) {
        if (p > 0) {
          finalLine += "\n";
          linecount++;
        }

        const words = paragraphs[p].split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let word = words[i];
          let testLine = currentLine + (currentLine ? " " : "") + word;
          let testWidth = this.textSizeEx(testLine).width;

          if (testWidth > maxWidth - 70 && currentLine !== "") {
            finalLine += currentLine + "\n";
            linecount++;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        finalLine += currentLine;
        if (currentLine) linecount++;
      }

      return {
        text: finalLine,
        lines: linecount,
      };
    };

    aliasMethod(Window_QuestInfo.prototype, "refresh", function (origin, text) {
      this.createContents();
      this.drawTextEx(
        this.wrapTextEx(applyTextMap(text), this.width).text,
        5,
        0,
        this.width,
      );
    });
  }

  if (typeof Window_FishCommand !== "undefined") {
    aliasMethod(
      Window_FishCommand.prototype,
      "drawItem",
      function (origin, index) {
        const rect = this.itemLineRect(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 20;
        this.changeTextColor("#462a39");
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        var text = "";
        if (index == 0) {
          var text = $gameTemp._selectRod ? $gameTemp._selectRod.name : "Không";
        } else if (index == 1) {
          var text = $gameTemp._selectLure ? $gameTemp._selectLure.name : "Không";
        }
        this.drawText(
          this.commandName(index) + text,
          rect.x + 30,
          rect.y - 2,
          rect.width,
          "left",
        );
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Layer 12: NPC Chat
  // ---------------------------------------------------------------------------
  if (typeof Window_LetterNpcInfo !== "undefined") {
    Window_LetterNpcInfo.prototype.wrapTextEx = function (text, maxWidth) {
      const words = text.split(" ");
      this.resetFontSettings();
      let linecount = 1;
      let finalLine = "";
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let testLine = currentLine + (currentLine ? " " : "") + word;
        // Use textSizeEx to get the real pixel width
        let testWidth = this.textSizeEx(testLine).width;

        if (testWidth > maxWidth - 70 && currentLine !== "") {
          finalLine += currentLine + "\n    ";
          linecount++;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      finalLine += currentLine; // Add the last line
      return {
        text: finalLine,
        lines: linecount,
      };
    };
    Window_LetterNpcInfo.prototype.numVisibleRows = function () {
      return 6;
    };
    Window_LetterNpcInfo.prototype.refresh = function (item) {
      this.contents.clear();
      this.contentsBack.clear();
      this.contents.fontSize = 18;
      this._item = item;
      this._list = [];
      var list = item.letterText;
      var newList = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i]) {
          const data = list[i].split("\n");
          for (let s = 0; s < data.length; s++) {
            newList.push(data[s]);
            if (data[s].match(/img[ ](.*)/i)) {
              const meta = RegExp.$1.split(" ");
              for (let s1 = 0; s1 < Number(meta[1]); s1++) {
                newList.push(" ");
              }
            }
          }
        }
      }
      this._list = newList;
      this.calculateDynamicHeights();
      if (this._list.length >= 200) {
        this._list.splice(0, 1);
      }
      if (this._list.length > 0) {
        this.drawAllItems();
      }
    };
    Window_LetterNpcInfo.prototype.calculateDynamicHeights = function () {
      this._itemHeights = [];
      this._itemY = [];
      let currentY = 0;

      // Assuming a 1-column layout for a text-heavy window
      for (let i = 0; i < this._list.length; i++) {
        const message = this._list[i];
        let height = 0;

        if (message) {
          if (message.match(/img[ ](.*)/i)) {
            // Set a fixed height for images so the window knows how much space to reserve
            height = 100; // Change this to match your actual image height
          } else {
            // Calculate how many lines this specific text block takes
            const paddedWidth = this.width - this.itemPadding() * 2;
            const wrapped = this.wrapTextEx(applyTextMap(message), paddedWidth);

            // .lines * line height
            height =
              (1 + ((wrapped.lines || 1) - 1) * 0.66) * this.lineHeight();
          }
        }

        // Add padding between items
        height += this.rowSpacing();

        // Cache the values
        this._itemHeights[i] = height;
        this._itemY[i] = currentY;

        // Push the next item's starting Y coordinate down
        currentY += height;
      }

      // Cache the total height for scrolling purposes
      this._totalScrollHeight = currentY;
    };
    Window_LetterNpcInfo.prototype.topIndex = function () {
      const scrollY = this.scrollY();
      const max = this.maxItems();

      for (let i = 0; i < max; i++) {
        // If the bottom of the item is past the scroll line, it's our top visible item
        if (this._itemY[i] + this.itemHeight(i) > scrollY) {
          return i;
        }
      }
      return 0;
    };
    Window_LetterNpcInfo.prototype.maxVisibleItems = function () {
      const top = this.topIndex();
      const bottomScreenEdge = this.scrollY() + this.innerHeight;
      const max = this.maxItems();
      let count = 0;

      for (let i = top; i < max; i++) {
        count++;
        // If the top of the next item starts past the bottom of the screen, we stop counting
        if (this._itemY[i] >= bottomScreenEdge) {
          break;
        }
      }
      // Add a +1 item buffer so items partially cut off at the bottom render perfectly
      return Math.min(count + 1, this.maxItems() - top);
    };
    Window_LetterNpcInfo.prototype.overallHeight = function () {
      return this._totalScrollHeight
        ? this._totalScrollHeight
        : this.maxRows() * this.itemHeight();
    };
    Window_LetterNpcInfo.prototype.drawItem = function (index) {
      const rect = this.itemLineRect(index);
      const message = this._list[index];
      if (message) {
        if (message.match(/img[ ](.*)/i)) {
          const meta = RegExp.$1.split(" ");
          const bitmap = ImageManager.loadBitmap("img/menu/", meta[0]);
          bitmap.addLoadListener(
            this.LoadNpcBitmap.bind(this, bitmap, index, meta),
          );
        } else {
          this.drawTextEx(
            this.wrapTextEx(applyTextMap(message), this.width).text,
            rect.x,
            rect.y,
            this.width,
          );
        }
      }
    };
    Window_LetterNpcInfo.prototype.itemLineRect = function (index) {
      const rect = this.itemRectWithPadding(index);
      const padding = (rect.height - this._itemHeights[index]) / 2;
      rect.y += padding;
      rect.height -= padding * 2;
      return rect;
    };
    Window_LetterNpcInfo.prototype.itemRect = function (index) {
      const maxCols = this.maxCols();
      const itemWidth = this.itemWidth();
      const itemHeight = this.itemHeight(index);
      const colSpacing = this.colSpacing();
      const rowSpacing = this.rowSpacing();
      const col = index % maxCols;
      const row = Math.floor(index / maxCols);
      const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
      const y = this._itemY[index] - this.scrollBaseY();
      const width = itemWidth - colSpacing;
      const height = this._itemHeights[index];
      return new Rectangle(x, y, width, height);
    };
  }

  if (typeof Window_NpcInfo !== "undefined") {
    Window_NpcInfo.prototype.resetFontSettings = function () {
      this.contents.fontFace = $gameSystem.mainFontFace();
      this.contents.fontSize = 16;
      this.resetTextColor();
    };
  }

  if (typeof Window_NpcTypeListCommand !== "undefined") {
    aliasMethod(
      Window_NpcTypeListCommand.prototype,
      "_updateCursor",
      function (origin) {
        this._cursorSprite.alpha = 0;
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y - 2;
        if (this.index() >= 0) {
          //  this._cursorSprites.alpha = this._makeCursorAlpha();;
          this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
          this._cursorSprites.x =
            this._cursorSprite.x + (this.index() == 1 ? -10 : 10);
          this._cursorSprites.y = this._cursorSprite.y + 10;
        } else {
          this._cursorSprites.visible = false;
        }
      },
    );

    aliasMethod(
      Window_NpcTypeListCommand.prototype,
      "drawItem",
      function (origin, index) {
        this.contents.fontSize = 20;
        const rect = this.itemLineRect(index);
        const type = this._list[index];
        if (type) {
          this.resetTextColor();
          this.contents.fontSize = 16;
          this.changeTextColor("#462a39");
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
          this.drawText(
            type,
            rect.x,
            rect.y,
            this.itemWidth() - this.contents.fontSize - 3,
            "center",
          );
        }
      },
    );

    aliasMethod(
      Window_LetterNpcCommand.prototype,
      "_updateCursor",
      function (origin) {
        this._cursorSprite.alpha = 0;
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
        if (this.index() >= 0 && this.active) {
          //  this._cursorSprites.alpha = this._makeCursorAlpha();;
          var x = 0;
          if (this.index() >= 1) {
            var x = 10;
          }
          this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
          this._cursorSprites.x =
            this._cursorSprite.x - 6 + (this.index() == 2 ? -10 : x);
          this._cursorSprites.y = this._cursorSprite.y + 16;
        } else {
          this._cursorSprites.visible = false;
        }
      },
    );

    aliasMethod(
      Window_LetterNpcCommand.prototype,
      "drawItem",
      function (origin, index) {
        this.contents.fontSize = 26;
        const rect = this.itemLineRect(index);
        const type = this._list[index];
        if (type) {
          this.resetTextColor();
          this.contents.fontSize = 16;
          this.changeTextColor("#462a39");
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
          this.drawText(
            type,
            rect.x,
            rect.y,
            this.itemWidth() - this.contents.fontSize,
            "center",
          );
        }
      },
    );
  }

  if (typeof Window_LetterNpcList !== "undefined") {
    aliasMethod(
      Window_LetterNpcList.prototype,
      "_updateCursor",
      function (origin) {
        this._cursorSprite.alpha = 0;
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x - 8;
        this._cursorSprite.y = this._cursorRect.y;
        if (this.index() >= 0 && this.active) {
          //  this._cursorSprites.alpha = this._makeCursorAlpha();;
          this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
          this._cursorSprites.x = this._cursorSprite.x;
          this._cursorSprites.y = this._cursorSprite.y;
        } else {
          this._cursorSprites.visible = false;
        }
      },
    );

    aliasMethod(
      Window_LetterNpcList.prototype,
      "drawItem",
      function (origin, index) {
        const rect = this.itemLineRect(index);
        const npc = this._list[index];
        this.contents.fontSize = 14;
        if (npc) {
          this.drawText(npc.name, rect.x, rect.y + 4, rect.width, "center");
        }
      },
    );
  }

  if (typeof Window_LetterNpcInfo !== "undefined") {
    aliasMethod(
      Window_LetterNpcInfo.prototype,
      "resetFontSettings",
      function () {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 16;
        this.resetTextColor();
        this.changeTextColor("#462a39");
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
      },
    );
  }

  if (typeof Window_ElixirStatus !== "undefined") {
    Window_ElixirStatus.prototype.refresh = function (data) {
      this.createContents();
      const actor = $gameParty.allMembers()[0];
      const elixirData = actor.getMaxElixirData();
      this._actor = actor;
      this._data = data;
      this.contents.fontSize = 16;
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
      this.changeTextColor("#462a39");
      this.drawText(
        "Cấp Luyện Đan: " + elixirData.level,
        15 + 20,
        4,
        this.width,
        "left",
      );
      this.drawText(
        "Kinh nghiệm Luyện Đan: " + elixirData.nowExp + "/" + elixirData.maxExp,
        180 + 20,
        4,
        this.width,
        "left",
      );
      this.drawText(
        "Độ thuần thục Luyện Đan: " + elixirData.value,
        410 + 20,
        4,
        this.width,
        "left",
      );

      var x = 0;
      var y = 370;
      this.contents.fontSize = 16;
      const itemList = data.item;
      for (let i = 0; i < itemList.length; i += 2) {
        if (itemList[i] > 0) {
          const id = itemList[i];
          const number = itemList[i + 1];
          const item = $dataItems[id];
          if (i == 0) {
            var x = 30 + 16;
            var y = 360;
          } else if (i == 2) {
            var x = 510 + 20;
            var y = 360;
          } else if (i == 4) {
            var x = 140 + 21;
            var y = 414;
          } else if (i == 6) {
            var x = 340 + 76;
            var y = 414;
          }
          this.drawIcon(item.iconIndex, x, y);
          this.drawText(
            item.name + "(" + $gameParty.numItems(item) + "/" + number + ")",
            x - 50,
            y - 40,
            150,
            "center",
          );
        }
      }
    };
  }

  if (typeof Window_NewItemCategory !== "undefined") {
    Window_NewItemCategory.prototype.drawItem = function (index) {
      const rect = this.itemLineRect(index);
      const align = this.itemTextAlign();
      this.resetTextColor();
      this.changePaintOpacity(this.isCommandEnabled(index));
      this.contents.fontSize = 20;
      this.changeTextColor("#462a39");
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
      this.drawText(
        this.commandName(index),
        rect.x + 8,
        rect.y,
        rect.width,
        "center",
      );
    };
  }

  if (typeof Window_NewItemList !== "undefined") {
    Window_NewItemList.prototype.drawItem = function (index) {
      const item = this.itemAt(index);
      if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 16;
        this.drawItemName(
          item,
          rect.x + 20,
          rect.y + 3,
          rect.width - numberWidth,
          index,
        );
        this.drawItemNumber(item, rect.x - 10, rect.y + 13, rect.width, index);
      }
    };

    Window_NewItemList.prototype.drawItemName = function (
      item,
      x,
      y,
      width,
      index,
    ) {
      if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        if (!this.isEnabled(item)) {
          this.changeTextColor(ColorManager.textColor(10));
          this.contents.outlineColor = ColorManager.textColor(10);
          this.contents.outlineWidth = 1;
        } else {
          this.changeTextColor("#462a39");
          this.contents.outlineColor = "#462a39";
          this.contents.outlineWidth = 1;
        }
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y - 6, itemWidth);
      }
    };

    Window_NewItemList.prototype.drawItemNumber = function (item, x, y, width) {
      if (this.needsNumber()) {
        if (!DataManager.isAloneItems(item)) {
          this.contents.fontSize = 14;
          this.drawText("Sở hữu: ", x, y, width - this.textWidth("00"), "right");
          this.drawText($gameParty.numItems(item), x, y, width, "right");
        }
      }
    };
  }

  if (typeof Window_ItemHelp !== "undefined") {
    Window_ItemHelp.prototype.initialize = function (rect) {
      rect.height += 200;
      Window_Base.prototype.initialize.call(this, rect);
      this._text = "";
      this.opacity = 0;
    };
    Window_ItemHelp.prototype.resetFontSettings = function () {
      this.contents.fontFace = $gameSystem.mainFontFace();
      this.contents.fontSize = 20;
      this.resetTextColor();
      this.changeTextColor("#462a39");
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
    };
    Window_ItemHelp.prototype.refresh = function () {
      const rect = this.baseTextRect();
      this.contents.clear();
      this.drawTextEx(
        this.wrapTextEx(this._text, rect.width),
        rect.x,
        rect.y,
        rect.width,
      );
    };
    Window_ItemHelp.prototype.wrapTextEx = function (text, maxWidth) {
      const paragraphs = String(text).split("\n");
      this.resetFontSettings();
      let finalLine = "";
      let linecount = 0;
      let prevLine = "";

      for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].split(" ");
        let currentLine = "";
        if (p > 0) {
          if (linecount < 2) {
            finalLine += "\n";
            linecount++;
          }
        }

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + (currentLine ? " " : "") + word;
          const testWidth = this.textSizeEx(
            linecount > 1 ? prevLine + testLine : testLine,
          ).width;

          if (testWidth > maxWidth - 30 && currentLine !== "") {
            finalLine += currentLine + "\n";
            linecount++;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        finalLine += currentLine;
        if (currentLine) linecount++;
        if (linecount > 1) prevLine = currentLine;
      }

      return finalLine;
    };
  }

  if (typeof Window_IntensifyEquipList !== "undefined") {
    Window_IntensifyEquipList.prototype.refresh = function () {
      this.contents.clear();
      this.contentsBack.clear();
      this._list = [];
      const weapons = $gameParty.weapons();
      const armors = $gameParty.armors();
      if ($gameTemp._selectEquipType == "Vũ khí" || $gameTemp._selectEquipType == "武器" || $gameTemp._selectEquipType == "Weapon") {
        for (let index = 0; index < weapons.length; index++) {
          const weapon = weapons[index];
          if (DataManager.isAloneItems(weapon) && weapon.meta.强化材料) {
            this._list.push(weapon);
          }
        }
      } else {
        for (let index = 0; index < armors.length; index++) {
          const armor = armors[index];
          if (
            DataManager.isAloneItems(armor) &&
            armor.etypeId != 8 &&
            armor.meta.强化材料
          ) {
            this._list.push(armor);
          }
        }
      }

      if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
      } else {
        this.contents.fontSize = 24;
        this.changeTextColor("#462a39");
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        this.drawText(
          "Không có trang bị có thể cường hóa",
          -10,
          this.height / 2 - 40,
          this.width,
          "center",
        );
        this.select(-1);
      }
    };
  }

  if (typeof Window_IntensifyEquipList_X !== "undefined") {
    Window_IntensifyEquipList_X.prototype.refresh = function () {
      this.contents.clear();
      this.contentsBack.clear();
      this._list = [];
      const weapons = $gameParty.weapons();
      const armors = $gameParty.armors();
      if ($gameTemp._selectEquipType == "Vũ khí" || $gameTemp._selectEquipType == "武器" || $gameTemp._selectEquipType == "Weapon") {
        for (let index = 0; index < weapons.length; index++) {
          const weapon = weapons[index];
          if (DataManager.isAloneItems(weapon) && weapon.meta.装备升级) {
            this._list.push(weapon);
          }
        }
      } else {
        for (let index = 0; index < armors.length; index++) {
          const armor = armors[index];
          if (
            DataManager.isAloneItems(armor) &&
            armor.etypeId != 8 &&
            armor.meta.装备升级
          ) {
            this._list.push(armor);
          }
        }
      }
      if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
      } else {
        this.contents.fontSize = 24;
        this.changeTextColor("#462a39");
        this.contents.outlineColor = "#462a39";
        this.contents.outlineWidth = 1;
        this.drawText(
          "Không có trang bị có thể nâng cấp",
          -10,
          this.height / 2 - 40,
          this.width,
          "center",
        );
        this.select(-1);
      }
    };
  }

  if (typeof Window_SellItemInfo !== "undefined") {
    Window_SellItemInfo.prototype.initialize = function (rect) {
      rect.width += 100;
      Window_Base.prototype.initialize.call(this, rect);
      this.opacity = 255;
      this.refresh(null);
    };

    Window_SellItemInfo.prototype.refresh = function (item) {
      this.createContents();
      this.contents.fontSize = 20;
      this.changeTextColor(ColorManager.textColor(0));
      this.drawText("Vật phẩm đang bán", 66, 4, this.width, "left");
      this.contents.fontSize = 20;
      this.contentsBack.fillRect(
        3,
        40,
        this.width,
        1,
        ColorManager.textColor(15),
      );
      this.contentsBack.fillRect(344, 40, 1, 450, ColorManager.textColor(15));
      this._item = item;
      if (this._item) {
        const meta = item.meta.卖出材料.split(",");
        const itemId = Number(meta[0]);
        if (SceneManager._scene._shopNumberInputWindow._number > 0) {
          this._number = SceneManager._scene._shopNumberInputWindow._number;
        } else {
          this._number = 1;
        }
        const itemNumber = Number(meta[1]) * this._number;
        const newItem = $dataItems[itemId];
        this.drawText(
          "Đang có " + newItem.name + ": " + $gameParty.numItems(newItem),
          0,
          8,
          this.width - 36,
          "right",
        );
        this.drawTextEx(
          "Sở hữu hiện tại：" + $gameParty.numItems(this._item),
          350,
          50,
          this.width,
          "left",
        );
        this.drawTextEx(
          "Giao dịch：" +
            itemNumber +
            "\\I[" +
            newItem.iconIndex +
            "] " +
            newItem.name,
          350,
          100,
        );
      }
    };

    Window_SellItemList.prototype.initialize = function (rect) {
      rect.width += 50;
      Window_Selectable.prototype.initialize.call(this, rect);
      this.opacity = 0;
      this._list = [];
      this.select(0);
      this.activate();
      this.refresh();
    };
    Window_SellItemList.prototype.drawItem = function (index) {
      this.contents.fontSize = 16;
      const rect = this.itemLineRect(index);
      const item = this._list[index];
      if (item) {
        const meta = item.meta.卖出材料.split(",");
        const itemId = Number(meta[0]);
        const itemNumber = Number(meta[1]);
        const newItem = $dataItems[itemId];
        this.changeTextColor(ColorManager.textColor(0));
        this.drawIcon(item.iconIndex, rect.x, rect.y + 1);
        this.drawText(item.name, rect.x + 36, rect.y);
        this.drawIcon(
          newItem.iconIndex,
          rect.x + this.itemWidth() - 50,
          rect.y + 1,
        );
        this.contents.fontSize = 20;
        this.drawText(
          itemNumber,
          rect.x,
          rect.y,
          this.itemWidth() - 50,
          "right",
        );
        this.resetTextColor();
      }
    };
    Window_ShopSellNumberInput.prototype.initialize = function (rect) {
      rect.width += 50;
      rect.x += 50;
      Window_Selectable.prototype.initialize.call(this, rect);
      this.opacity = 0;
      this._item = null;
      this._max = $gameParty.maxItems();
      this._number = 1;
      this.createButtons();
      this.refresh();
      this.select(0);
    };
    Window_ShopSellNumberInput.prototype.drawNumber = function () {
      const x = this.cursorX();
      const y = this.itemNameY();
      const width = this.cursorWidth() - this.itemPadding();
      this.resetTextColor();
      this.drawText("Số lượng", -80, y, this.width, "right");
      this.contents.fontSize = 20;
      this.drawText(this._number, x + 2, y, width, "right");
    };
    Window_ShopSellNumberInput.prototype.drawCurrentItemName = function () {
      const padding = this.itemPadding();
      const x = padding * 2;
      const y = this.itemNameY();
      const width = this.multiplicationSignX() - padding * 3;
      this.contents.fontSize = 16;
      if (this._item) this.drawItemName(this._item, x - 10, y, width);
    };
  }

  if (typeof Window_VictoryItem !== "undefined") {
    Window_VictoryItem.prototype.drawItem = function (index) {
      const rect = this.itemRect(index);
      rect.width += 100;
      const name = this._list[index].name;
      const iconIndex = this._list[index].iconIndex;
      this.contents.fontSize = 16;
      this.drawIcon(iconIndex, rect.x, rect.y + 3, 20, 20);
      this.changeTextColor("#462a39");
      this.contents.outlineColor = "#462a39";
      this.contents.outlineWidth = 1;
      this.drawText(name, rect.x + 36, rect.y, this.itemWidth(), "left");
      this.resetTextColor();
    };
  }

  console.log(
    `[${PLUGIN_NAME}] Loaded (${Object.keys(TEXT_MAP).length} textMap entries)`,
  );
})();
