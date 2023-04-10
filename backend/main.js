const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Pool } = require("pg");
const stripe = require("stripe")(
    process.env.STRIPE_SECRET_KEY || "sk_test_51Mh2sVADW7HKLIBbDnTG5vuOif1yFUCwbdpRpdiFfcrdXAYhos4HphRWyJA0cbLZAmacK5x5FrMZz7ZPIoGdgq9G00LisSyCVt"
);
const crypto = require('crypto');
const mailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyKey = "";

const DEFAULT_TEMPLATE_1 =
    "自由記入:\tスカート\n,\tフレンチスクエア\n,\tニットセーター\n,\tラビットファーセーター\n,\tバフスリーブ\n,\tストライプ　シャツ\n,\tレトロ\n,\tデニム スカート\n,\tリブニット\n,\tリブニット\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t大\n:\tトップス\n,\tスカート\n,\tボトムス\n,\tパンツ\n,\tアウター\n,\tワンピース\n,\tセットアップ\n,\tルームウェア\n,\tパジャマ\n,\t迷彩\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t中\n:\tTシャツ\n,\tシャツ\n,\tブラウス\n,\tカットソー\n,\tニットソー\n,\tセーター\n,\tカーディガン\n,\tプルオーバー\n,\tパーカー\n,\tトレーナー\n,\tベスト\n,\tフーディー\n,\tオールインワン\n,\tサロペット\n,\tチュニック\n,\tコート\n,\tブルゾン\n,\tジャケット\n,\tシャンパー\n,\tGジャン\n,\tGパン\n,\tズボン\n,\t上着\n,\tスーツ\n,\tスウェット\n,\tジャージ\n,\t部屋着\n,\t寝巻き\n,\tナイトウェア\n,\t着ぐるみ\n,\tコスプレ\n,\tレギンス\n,\tレギパン\n,\tキャミソール\n,\tガウン\n,\t着る毛布\n,\tネグリジェ\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t小\n:\t白シャツ\n,\t白トップス\n,\tビッグT\n,\tジョガーパンツ\n,\tワイドパンツ\n,\tストレートパンツ\n,\tガウチョパンツ\n,\tジョガーパンツ\n,\tクロップドパンツ\n,\tデニムパンツ\n,\tスキニーパンツ\n,\tベイカーパンツ\n,\tサルエルパンツ\n,\tカラーパンツ\n,\tテーパードパンツ\n,\tバギーパンツ\n,\tショートパンツ\n,\tミニスカート\n,\tロングスカート\n,\tプリーツスカート\n,\tフレアスカート\n,\tチュールスカート\n,\tペンシルスカート\n,\tコクーンスカート\n,\tタイトスカート\n,\tニットスカート\n,\tデニムスカート\n,\tタックスカート\n,\tジャンパースカート\n,\tジャンスカ\n,\tもこもこアウター\n,\tボアブルゾン\n,\tロングコート\n,\tチェスターコート\n,\tトレンチコート\n,\tダウンコート\n,\tシャツワンピース\n,\tフレアワンピース\n,\tティアードワンピース\n,\tロジスワンピース\n,\tデニムワンピース\n,\tワンピドレス\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t丈\n:\tミニ\n,\tミニ丈\n,\tショート\n,\tショート丈\n,\t膝丈\n,\tひざ丈\n,\t膝上\n,\t膝下\n,\tミモレ\n,\tミモレ丈\n,\tロング\n,\tロング丈\n,\tマキシ\n,\tマキシ丈\n,\t9分丈\n,\tアンクル丈\n,\t7分丈\n,\tミディアム丈\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t袖\n:\t袖なし\n,\t袖あり\n,\tノースリーブ\n,\t半袖\n,\t5分袖\n,\t五分袖\n,\t7分袖\n,\t七分袖\n,\t長袖\n,\tボリューム袖\n,\tドルマンスリーブ\n,\tパフスリーブ\n,\tフレアスリーブ\n,\tフレンチスリーブ\n,\tホルンスリーブ\n,\tドロップショルダー\n,\t萌袖\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t首回り\n:\tVネック\n,\tUネック\n,\tラウンドネック\n,\tスクエアネック\n,\tカシュクール\n,\tハイネック\n,\tタートルネック\n,\tクルーネック\n,\tヘンリーネック\n,\tボートネック\n,\tオフショルダー\n,\tオフショル\n,\tワンショルダー\n,\tワンショル\n,\t襟付き\n,\t襟なし\n,\tスタンドカラー\n,\tホルターネック\n,\tハイネック\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t形\n:\tフレア\n,\tセミフレア\n,\tスリム\n,\tタイト\n,\t細身\n,\tストレート\n,\tワイド\n,\tガウチョ\n,\tペプラム\n,\tAライン\n,\tIライン\n,\tマーメイド\n,\tアシンメトリー\n,\t切り替えデザイン\n,\tドッキング\n,\tスマート\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tデザイン\n:\tプリーツ\n,\tレース\n,\t刺繍\n,\tチュール\n,\tシフォン\n,\tフリル\n,\tリボン\n,\tベルト\n,\tウエストマーク\n,\tウエストリボン\n,\tバックリボン\n,\tスリット\n,\tサイドスリット\n,\tバックスリット\n,\t切り替えデザイン\n,\tドッキング\n,\tバックシャン\n,\tバックコンシャス\n,\tもこもこ\n,\tモコモコ\n,\tふわふわ\n,\tフード付き\n,\tファスナー\n,\tポケット\n,\tハイウエスト\n,\tリブ\n,\t前開き\n,\t2way\n,\t3way\n,\tリバーシブル\n,\tウエストゴム\n,\tケーブルニット\n,\tリブニット\n,\tクロシェ\n,\t編み込み\n,\t透け感\n,\tシースルー\n,\t伸縮性\n,\tキルティング\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t素材\n:\t綿\n,\t麻\n,\tリネン\n,\tポリエステル\n,\tデニム\n,\tブルーデニム\n,\tカラーデニム\n,\tキルティング\n,\tニット\n,\tサマーニット\n,\tフリース\n,\tウール\n,\tダウン\n,\tボア\n,\tレザー\n,\tPU\n,\tファー\n,\tフェイクファー\n,\t薄手\n,\t厚手\n,\t裏起毛\n,\tフランネル\n,\tコーデュロイ\n,\tスウェード\n,\tベロア\n,\t異素材MIX\n,\tベルベット\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tセット\n:\t上下セット\n,\t2点セット\n,\t3点セット\n,\t4点セット\n,\t5点セット\n,\tツーピース\n,\tスリーピース\n,\tお得\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tイメージ\n:\tかわいい\n,\t大人可愛い\n,\tきれいめ\n,\tシンプル\n,\tカジュアル\n,\t大人\n,\t上品\n,\tおしゃれ\n,\tお洒落\n,\tかっこいい\n,\tレトロ\n,\tアジアン\n,\tエスニック\n,\tエキゾチック\n,\t大人可愛い\n,\t大人女子\n,\tこなれ感\n,\tラフ\n,\tメンズライク\n,\tマニッシュ\n,\tボーイッシュ\n,\tスポーティー\n,\tラブリー\n,\tキュート\n,\tガーリー\n,\tルーズ\n,\t個性的\n,\tクール\n,\tモード系\n,\tセクシー\n,\tエレガント\n,\tモダン\n,\t主役級\n,\t存在感\n,\tフォーマル\n,\tとろみ感\n,\t抜け感\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t柄\n:\t無地\n,\t柄\n,\t花柄\n,\t小花柄\n,\tフラワー\n,\tチェック柄\n,\t格子柄\n,\t千鳥格子\n,\tグレンチェック\n,\tドット柄\n,\t水玉\n,\tボーダー\n,\tストライプ\n,\tヒョウ柄\n,\tレオパード\n,\tセブラ柄\n,\t牛柄\n,\tアニマル柄\n,\tリーフ柄\n,\tボタニカル\n,\tプリント\n,\tキャラクター\n,\tシマ\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t季節・行事\n:\t春\n,\t夏\n,\t秋\n,\t冬\n,\tオールシーズン\n,\tシーズンレス\n,\t誕生日\n,\t成人式\n,\t入学式\n,\t入園式\n,\t卒業式\n,\t卒園式\n,\t謝恩会\n,\t結婚式\n,\t二次会\n,\t披露宴\n,\t冠婚葬祭\n,\t母の日\n,\tハロウィン\n,\tクリスマス\n,\tバレンタイン\n,\t2020\n,\t2021\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t年代・性別\n:\t10代\n,\t20代\n,\t30代\n,\t40代\n,\t50代\n,\t60代\n,\tレディース\n,\tメンズ\n,\tペア\n,\t女性用\n,\t男性用\n,\t男女兼用\n,\tママ\n,\tマタニティ\n,\tキッズ\n,\t女の子\n,\t男の子\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t場所\n:\tオフィス\n,\tビジネス\n,\tOL\n,\t通勤\n,\t学生\n,\t通学\n,\tデート\n,\tお出かけ\n,\t公園デビュー\n,\t女子会\n,\tお泊まり\n,\t休日\n,\t運動\n,\tジム\n,\tヨガ\n,\tアウトドア\n,\tパーティー\n,\tイベント\n,\tリゾート\n,\t旅行\n,\t海\n,\tプール\n,\tリクルート\n,\t就活\n,\t高原\n,\tホテル\n,\tガーデン\n,\tレストラン\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tその他\n:\t着回し\n,\t普段使い\n,\t重ね着\n,\tお揃い\n,\t双子\n,\t韓国\n,\t韓国系\n,\tオルチャン\n,\tファッション\n,\tコーデ\n,\tスタイル\n,\t楽ちん\n,\tir\n,\t暖かい\n,\t防寒\n,\tモテ\n,\tダメージ\n,\t穴あき\n,\t体系カバー\n,\t美脚\n,\t脚長\n,\tプレゼント\n,\tギフト\n,\t新作\n,\t定番\n,\tプチプラ\n,\t激安\n,\t安い\n,\t送料無料\n,\tトレンド\n,\t流行\n,\tインスタ映え\n,\t即納\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tサイズ\n:\tサイズ\n,\tXXS\n,\tXS\n,\tS\n,\tM\n,\tL\n,\tXL\n,\t2XL\n,\t3XL\n,\t4XL\n,\t5XL\n,\t6XL\n,\t小さいサイズ\n,\t大きいサイズ\n,\tフリーサイズ\n,\t大きい\n,\t大きめ\n,\tビッグサイズ\n,\tゆったり\n,\tゆる\n,\tサイズ\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tカラー\n:\t色展開\n,\t白\n,\tホワイト\n,\t黒\n,\tブラック\n,\t赤\n,\tレッド\n,\t青\n,\tブルー\n,\t緑\n,\tグリーン\n,\t紫\n,\tパープル\n,\t茶色\n,\tブラウン\n,\t灰色\n,\tグレー\n,\t黄色\n,\tオフホワイト\n,\tベージュ\n,\tカーキ\n,\tイエロー\n,\tピンク\n,\tオレンジ\n,\t水色\n,\tワインレッド\n,\tネイビー\n,\t金色\n,\t銀色\n,\tゴールド\n,\tシルバー\n,\tパステルカラー\n,\tくすみカラー\n,\t大人カラー\n,\tベイクドカラー\n,\tバイカラー\n,\tモノトーン\n,\t春カラー\n,\t秋カラー\n,\tニュアンスカラー\n,\tカラバリ\n,\tミリタリー\n,\t光沢\n,\tメタリック\n,\tアプリコット\n,\tライトブルー\n,\t,\t,\t,\t,\t,\t";
const DEFAULT_TEMPLATE_2 =
    "自由記入:\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t大\n:\tシューズ\n,\t靴\n,\tくつ\n,\tクツ\n,\tスニーカー\n,\tブーツ\n,\tパンプス\n,\tスリッポン\n,\tサンダル\n,\tミュール\n,\tスリッパ\n,\tファーサンダル\n,\tファーパンプス\n,\tスポサン\n,\tスポーツサンダル\n,\tミュールサンダル\n,\tクロックス\n,\tベルクロ\n,\tつっかけ\n,\tルームシューズ\n,\tルームスリッパ\n,\t室内履き\n,\tパブーシュ\n,\t健康サンダル\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t中\n:\tレディースシューズ\n,\tランニングシューズ\n,\tスポーツシューズ\n,\tレディーススニーカー\n,\t厚底スニーカー\n,\tダッドスニーカー\n,\tボリュームスニーカー\n,\tダンススニーカー\n,\tダンスシューズ\n,\tレディースブーツ\n,\tショートブーツ\n,\tロングブーツ\n,\tニーハイブーツ\n,\tミドルブーツ\n,\tアンクルブーツ\n,\tムートンブーツ\n,\t足袋ブーツ\n,\tブーティー\n,\tソックススニーカー\n,\tソックスブーツ\n,\tレインシューズ\n,\tレインブーツ\n,\t長靴\n,\tスノーブーツ\n,\tレディースパンプス\n,\tラウンドトゥパンプス\n,\tスクエアトゥパンプス\n,\tポインテッドトゥパンプス\n,\tフラットシューズ\n,\tぺたんこシューズ\n,\tぺたんこパンプス\n,\tバレエシューズ\n,\tローファー\n,\t革靴\n,\tモカシン\n,\tデッキシューズ\n,\tパーティーシューズ\n,\tビジネスシューズ\n,\t通勤シューズ\n,\t通勤パンプス\n,\tフォーマルシューズ\n,\tヒールパンプス\n,\tヒールシューズ\n,\tレディースサンダル\n,\t厚底サンダル\n,\tヒールサンダル\n,\tウッドソールサンダル\n,\tサボ\n,\tサボサンダル\n,\tコンフォートサンダル\n,\tファーサンダル\n,\tファーパンプス\n,\tスポサン\n,\tスポーツサンダル\n,\tミュールサンダル\n,\tクロックス\n,\tベルクロ\n,\tつっかけ\n,\tルームシューズ\n,\tルームスリッパ\n,\t室内履き\n,\tパブーシュ\n,\t健康サンダル\n,\t;\tヒール:\tヒール\n,\tハイヒール\n,\t7cmヒール\n,\t5cmヒール\n,\t3cmヒール\n,\t1cmヒール\n,\t厚底\n,\tピンヒール\n,\t太ヒール\n,\tチャンキーヒール\n,\tミドルヒール\n,\tローヒール\n,\tインヒール\n,\tフラット\n,\tぺたんこ\n,\tペタンコ\n,\tヒールレス\n,\tウッドソール\n,\tクリアヒール\n,\tかかと無し\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tデザイン・形\n:\tラウンドトゥ\n,\tスクエアトゥ\n,\tポインテッドトゥ\n,\tストラップ\n,\tアンクルストラップ\n,\tレース\n,\t刺繍\n,\tフリル\n,\tリボン\n,\tもこもこ\n,\tモコモコ\n,\tふわふわ\n,\t痛くない\n,\t歩きやすい\n,\t履きやすい\n,\t走れる\n,\t疲れにくい\n,\t幅広\n,\t甲高\n,\t3E\n,\t4E\n,\tベルト\n,\tバックル\n,\tタッセル\n,\tフリンジ\n,\tパール\n,\tビジュー\n,\tキラキラ\n,\tラメ\n,\tプリーツ\n,\tボタン\n,\tチャーム\n,\tロゴ\n,\t防水\n,\t撥水\n,\t柔らかい\n,\tコンパクト\n,\t軽量\n,\t軽い\n,\t裏ボア\n,\t防寒\n,\t暖かい\n,\tあったか\n,\t美脚\n,\t脚長\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t素材\n:\t革\n,\t合皮\n,\t本革\n,\t牛革\n,\tレザー\n,\tフェイクレザー\n,\tPU\n,\tスウェード\n,\tベロア\n,\tコーデュロイ\n,\tファー\n,\tファー付き\n,\tエコファー\n,\tフェイクファー\n,\tボア\n,\tポリエステル\n,\t綿\n,\t麻\n,\tリネン\n,\t帆布\n,\tキャンバス\n,\tナイロン\n,\tデニム\n,\tブルーデニム\n,\tカラーデニム\n,\t薄手\n,\t厚手\n,\t異素材MIX\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tイメージ\n:\tかわいい\n,\t大人可愛い\n,\tきれいめ\n,\tシンプル\n,\tカジュアル\n,\t大人\n,\t上品\n,\tおしゃれ\n,\tお洒落\n,\tかっこいい\n,\tレトロ\n,\tフォーマル\n,\tエレガント\n,\tきちんと感\n,\tラブリー\n,\tキュート\n,\tガーリー\n,\t大人っぽい\n,\t女っぽ\n,\tスポーティー\n,\tメンズライク\n,\tマニッシュ\n,\tボーイッシュ\n,\tラフ\n,\tルーズ\n,\t個性的\n,\tクール\n,\tモード系\n,\tセクシー\n,\tモダン\n,\t主役級\n,\t存在感\n,\tこなれ感\n,\tとろみ感\n,\t抜け感\n,\tアジアン\n,\tエスニック\n,\tエキゾチック\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t柄\n:\t無地\n,\t柄\n,\t花柄\n,\t小花柄\n,\tフラワー\n,\tチェック柄\n,\t格子柄\n,\t千鳥格子\n,\tグレンチェック\n,\tドット柄\n,\t水玉\n,\tボーダー\n,\tストライプ\n,\tヒョウ柄\n,\tレオパード\n,\tセブラ柄\n,\t牛柄\n,\tアニマル柄\n,\tリーフ柄\n,\tボタニカル\n,\tプリント\n,\tキャラクター\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t季節・行事\n:\t春\n,\t夏\n,\t秋\n,\t冬\n,\tオールシーズン\n,\tシーズンレス\n,\t誕生日\n,\t成人式\n,\t入学式\n,\t入園式\n,\t卒業式\n,\t卒園式\n,\t謝恩会\n,\t結婚式\n,\t二次会\n,\t披露宴\n,\t冠婚葬祭\n,\t母の日\n,\t父の日\n,\tハロウィン\n,\tクリスマス\n,\tバレンタイン\n,\t2020\n,\t2021\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t年代・性別\n:\t10代\n,\t20代\n,\t30代\n,\t40代\n,\t50代\n,\t60代\n,\tレディース\n,\tメンズ\n,\tペア\n,\t女性用\n,\t男性用\n,\t男女兼用\n,\tママ\n,\tマザー\n,\tマザーズ\n,\tマタニティ\n,\tキッズ\n,\t女の子\n,\t男の子\n,\tユニセックス\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t場所\n:\tオフィス\n,\tビジネス\n,\tOL\n,\t通勤\n,\t学生\n,\t通学\n,\tデート\n,\tお出かけ\n,\t公園デビュー\n,\t女子会\n,\tお泊まり\n,\t休日\n,\t運動\n,\tジム\n,\tヨガ\n,\tアウトドア\n,\tパーティー\n,\tイベント\n,\tリゾート\n,\t旅行\n,\t海\n,\tプール\n,\tリクルート\n,\t就活\n,\t海外\n,\t高原\n,\tホテル\n,\tガーデン\n,\tレストラン\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tその他\n:\tデイリー\n,\t普段使い\n,\tお揃い\n,\t双子\n,\t韓国\n,\t韓国系\n,\tオルチャン\n,\tファッション\n,\tコーデ\n,\tスタイル\n,\t高見え\n,\t格上げ\n,\tモテ\n,\tプレゼント\n,\tギフト\n,\t新作\n,\t定番\n,\tプチプラ\n,\t激安\n,\t安い\n,\t送料無料\n,\tトレンド\n,\t流行\n,\tインスタ映え\n,\t即納\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tサイズ\n:\tサイズ\n,\t22.5cm\n,\t23.0cm\n,\t23.5cm\n,\t24.0cm\n,\t24.5cm\n,\t25.0cm\n,\t25.5cm\n,\t26.0cm\n,\t22.5-23.0cm\n,\t23.0-23.5cm\n,\t23.5-24.0cm\n,\t24.0-24.5cm\n,\t24.5-25.0cm\n,\t25.0-25.5cm\n,\t25.5-26.0cm\n,\t小さいサイズ\n,\t大きいサイズ\n,\tフリーサイズ\n,\tワンサイズ\n,\t大きい\n,\t小さい\n,\tビッグ\n,\tミニ\n,\tビッグサイズ\n,\tミニサイズ\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tカラー\n:\t色展開\n,\t白\n,\tホワイト\n,\t黒\n,\tブラック\n,\t赤\n,\tレッド\n,\t青\n,\tブルー\n,\t緑\n,\tグリーン\n,\t紫\n,\tパープル\n,\t茶色\n,\tブラウン\n,\t灰色\n,\tグレー\n,\t黄色\n,\tオフホワイト\n,\tベージュ\n,\tカーキ\n,\tイエロー\n,\tピンク\n,\tオレンジ\n,\t水色\n,\tワインレッド\n,\tネイビー\n,\t金色\n,\t銀色\n,\tゴールド\n,\tシルバー\n,\tパステルカラー\n,\tくすみカラー\n,\t大人カラー\n,\tベイクドカラー\n,\tバイカラー\n,\tモノトーン\n,\t春カラー\n,\t秋カラー\n,\tニュアンスカラー\n,\tカラバリ\n,\tミリタリー\n,\t光沢\n,\tメタリック\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t";
const DEFAULT_TEMPLATE_3 =
    "自由記入:\t個性的\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t大\n:\tバッグ\n,\tバック\n,\tカバン\n,\tかばん\n,\t鞄\n,\t\n,\t\n,\t財布\n,\tサイフ\n,\tさいふ\n,\t\n,\tウォレット\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t中（バッグ）:\tレディースバッグ\n,\tレディースバック\n,\tショルダーバッグ\n,\tショルダーバック\n,\tハンドバッグ\n,\tハンドバック\n,\tトートバッグ\n,\tトートバック\n,\tリュック\n,\tリュックサック\n,\t通勤バッグ\n,\t通勤バック\n,\tビジネスバッグ\n,\tビジネスバック\n,\tエコバッグ\n,\tエコバック\n,\tバッグインバッグ\n,\tママバッグ\n,\tマザーズバッグ\n,\tマザーズバック\n,\tマザーズリュック\n,\t斜めがけバッグ\n,\t斜め掛けバッグ\n,\t肩がけバック\n,\t肩掛けバック\n,\t手持ちバッグ\n,\t手持ちカバン\n,\tミニバッグ\n,\t小バッグ\n,\tパソコンバッグ\n,\tパソコンケース\n,\tpcバッグ\n,\t旅行バッグ\n,\t旅行バック\n,\t旅行カバン\n,\tキャリーバッグ\n,\tかごバッグ\n,\t買い物バッグ\n,\t仕事用リュック\n,\t仕事用カバン\n,\tビニールバッグ\n,\t三角バッグ\n,\tパーティーバッグ\n,\tクラッチバッグ\n,\tポシェット\n,\tポーチ\n,\tバッグパック\n,\t巾着バッグ\n,\tウエストポーチ\n,\tボディバッグ\n,\tお財布ポシェット\n,\tお財布バッグ\n,\tレジカゴバック\n,\tショッピングバッグ\n,\tボストンバッグ\n,\tデイバッグ\n,\t,\t,\t,\t,\t,\t,\t,\t;\t中（財布）:\tレディース財布\n,\t長財布\n,\tミニ財布\n,\t極小財布\n,\t薄型財布\n,\t二つ折り財布\n,\t三つ折り財布\n,\t春財布\n,\t秋財布\n,\tロングウォレット\n,\tミニウォレット\n,\t小さい財布\n,\t本革財布\n,\tカードケース\n,\tカード入れ\n,\tコインケース\n,\t小銭入れ\n,\t定期入れ\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t機能（バッグ）:\t2way\n,\t3way\n,\t大容量\n,\t収納\n,\t多収納\n,\t多機能\n,\t機能性\n,\t便利\n,\ta4\n,\tA4\n,\t斜めがけ\n,\t斜め掛け\n,\t肩がけ\n,\t肩掛け\n,\t手持ち\n,\t折りたたみ\n,\tコンパクト\n,\t軽量\n,\t軽い\n,\t自立\n,\tリバーシブル\n,\tショルダー\n,\tワンショルダー\n,\t防水\n,\t撥水\n,\t使いやすい\n,\t柔らかい\n,\t保冷\n,\t保温\n,\tマチ広\n,\t仕切り\n,\tインナーバッグ付き\n,\tセット\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t機能（財布）\n:\t二つ折り\n,\t三つ折り\n,\t大容量\n,\t収納\n,\t多収納\n,\t多機能\n,\t機能性\n,\t便利\n,\tラウンドファスナー\n,\tL字ファスナー\n,\tギャルソン\n,\tキャッシュレス\n,\tカードたくさん\n,\tカード収納\n,\tコンパクト\n,\t軽量\n,\t軽い\n,\t薄型\n,\tスリム\n,\t極スリム\n,\tリバーシブル\n,\t防水\n,\t撥水\n,\t使いやすい\n,\t柔らかい\n,\tスキミング防止\n,\t磁気防止\n,\tスキミング機能防止付き\n,\t仕切り\n,\tセット\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tデザイン・形\n:\tスクエア型\n,\t四角\n,\tラウンド型\n,\t丸型\n,\tがまぐち\n,\tがま口\n,\t釜口\n,\tバケツ型\n,\t巾着\n,\t手帳型\n,\tBOX型\n,\tチリトリ型\n,\tじゃばら\n,\t蛇腹\n,\tレース\n,\t刺繍\n,\tフリル\n,\tリボン\n,\tベルト\n,\tタッセル\n,\tフリンジ\n,\tパール\n,\tプリーツ\n,\tファスナー\n,\tボタン\n,\tポケット\n,\tチャーム\n,\tファスナー付き\n,\t背面ファスナー\n,\tサイドポケット\n,\tもこもこ\n,\tモコモコ\n,\tふわふわ\n,\tクロコ 型押し\n,\tクロコダイル 型押し\n,\tクロコ型\n,\tミニトート\n,\tキルティング\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t素材\n:\t革\n,\t合皮\n,\t本革\n,\t牛革\n,\tレザー\n,\tフェイクレザー\n,\tPU\n,\tポリエステル\n,\t綿\n,\t麻\n,\tリネン\n,\t帆布\n,\tキャンバス\n,\tナイロン\n,\tデニム\n,\tブルーデニム\n,\tカラーデニム\n,\t籠\n,\tかご\n,\tカゴ\n,\tバンブー\n,\tビニール\n,\tファー\n,\tエコファー\n,\tフェイクファー\n,\tキルティング\n,\tニット\n,\tフリース\n,\tボア\n,\tスウェード\n,\tベロア\n,\tコーデュロイ\n,\t薄手\n,\t厚手\n,\t異素材MIX\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tイメージ\n:\tかわいい\n,\t大人可愛い\n,\tきれいめ\n,\tシンプル\n,\tカジュアル\n,\t大人\n,\t上品\n,\tおしゃれ\n,\tお洒落\n,\tかっこいい\n,\tレトロ\n,\tアジアン\n,\tエスニック\n,\tエキゾチック\n,\t大人可愛い\n,\t大人女子\n,\tこなれ感\n,\tラフ\n,\tメンズライク\n,\tマニッシュ\n,\tボーイッシュ\n,\tスポーティー\n,\tラブリー\n,\tキュート\n,\tガーリー\n,\tルーズ\n,\t個性的\n,\tクール\n,\tモード系\n,\tセクシー\n,\tエレガント\n,\tモダン\n,\t主役級\n,\t存在感\n,\tフォーマル\n,\tとろみ感\n,\t抜け感\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t柄\n:\t無地\n,\t柄\n,\t花柄\n,\t小花柄\n,\tフラワー\n,\tチェック柄\n,\t格子柄\n,\t千鳥格子\n,\tグレンチェック\n,\tドット柄\n,\t水玉\n,\tボーダー\n,\tストライプ\n,\tヒョウ柄\n,\tレオパード\n,\tセブラ柄\n,\t牛柄\n,\tアニマル柄\n,\tリーフ柄\n,\tボタニカル\n,\tプリント\n,\tキャラクター\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t年代・性別\n:\t10代\n,\t20代\n,\t30代\n,\t40代\n,\t50代\n,\t60代\n,\tレディース\n,\tメンズ\n,\tペア\n,\t女性用\n,\t男性用\n,\t男女兼用\n,\tママ\n,\tマザー\n,\tマザーズ\n,\tマタニティ\n,\tキッズ\n,\t女の子\n,\t男の子\n,\tユニセックス\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t場所\n:\tオフィス\n,\tビジネス\n,\tOL\n,\t通勤\n,\tリクルート\n,\t就活\n,\t学生\n,\t通学\n,\tデート\n,\tお出かけ\n,\t公園デビュー\n,\t女子会\n,\tお泊まり\n,\t休日\n,\tスポーツ\n,\t運動\n,\tジム\n,\tヨガ\n,\tアウトドア\n,\tパーティー\n,\tイベント\n,\tリゾート\n,\t旅行\n,\t海\n,\tプール\n,\tお買い物\n,\tレジ\n,\tカゴ\n,\tスーパー\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tその他\n:\tデイリー\n,\t普段使い\n,\tお揃い\n,\t双子\n,\t韓国\n,\t韓国系\n,\tオルチャン\n,\tファッション\n,\tコーデ\n,\tスタイル\n,\t高見え\n,\t格上げ\n,\tモテ\n,\tダメージ\n,\t穴あき\n,\tプレゼント\n,\tギフト\n,\t新作\n,\t定番\n,\tプチプラ\n,\t激安\n,\t安い\n,\t送料無料\n,\tトレンド\n,\t流行\n,\tインスタ映え\n,\t即納\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t季節・行事\n:\t春\n,\t夏\n,\t秋\n,\t冬\n,\tオールシーズン\n,\tシーズンレス\n,\t誕生日\n,\t成人式\n,\t入学式\n,\t入園式\n,\t卒業式\n,\t卒園式\n,\t謝恩会\n,\t結婚式\n,\t二次会\n,\t披露宴\n,\t冠婚葬祭\n,\t母の日\n,\t父の日\n,\tハロウィン\n,\tクリスマス\n,\tバレンタイン\n,\t2020\n,\t2021\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tサイズ\n:\tサイズ\n,\t大きめ\n,\t小さめ\n,\t大きい\n,\t小さい\n,\tビッグ\n,\tミニ\n,\tビッグサイズ\n,\tミニサイズ\n,\ta4\n,\tA4\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tカラー\n:\t色展開\n,\t白\n,\tホワイト\n,\t黒\n,\tブラック\n,\t赤\n,\tレッド\n,\t青\n,\tブルー\n,\t緑\n,\tグリーン\n,\t紫\n,\tパープル\n,\t茶色\n,\tブラウン\n,\t灰色\n,\tグレー\n,\t黄色\n,\tオフホワイト\n,\tベージュ\n,\tカーキ\n,\tイエロー\n,\tピンク\n,\tオレンジ\n,\t水色\n,\tワインレッド\n,\tネイビー\n,\t金色\n,\t銀色\n,\tゴールド\n,\tシルバー\n,\tパステルカラー\n,\tくすみカラー\n,\t大人カラー\n,\tベイクドカラー\n,\tバイカラー\n,\tモノトーン\n,\t春カラー\n,\t秋カラー\n,\tニュアンスカラー\n,\tカラバリ\n,\tミリタリー\n,\t光沢\n,\tメタリック\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t";
const DEFAULT_TEMPLATE_4 =
    "自由記入:\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t大\n:\tドレス\n,\t\n,\t衣装\n,\tワンピース\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t中\n:\tウェディングドレス\n,\tパーティードレス\n,\tパーティドレス\n,\t結婚式ドレス\n,\t結婚式のドレス\n,\t二次会ドレス\n,\t披露宴ドレス\n,\t花嫁ドレス\n,\tカラードレス\n,\tロングドレス\n,\tミモレ丈ドレス\n,\t膝丈ドレス\n,\tミニドレス\n,\t演奏会ドレス\n,\t演奏会用ドレス\n,\t発表会ドレス\n,\tステージドレス\n,\t舞台衣装\n,\t舞台ドレス\n,\tフォーマルドレス\n,\tキャバドレス\n,\tキャバ ワンピ\n,\tキャバ嬢ドレス\n,\tキャバ 衣装\n,\tタイトドレス\n,\tAラインドレス\n,\tIラインドレス\n,\tマーメイドドレス\n,\tエンパイアドレス\n,\tカクテルドレス\n,\tイブニングドレス\n,\tブラックドレス\n,\tワンピースドレス\n,\tワンピドレス\n,\tカジュアルドレス\n,\tパンツドレス\n,\tチャイナドレス\n,\tナイトドレス\n,\tセクシードレス\n,\tボディコン\n,\tコスプレ\n,\tコスチューム\n,\tダンス衣装\n,\tダンスドレス\n,\t,\t;\t丈\n:\tミニ\n,\tミニ丈\n,\t超ミニ\n,\tショート\n,\tショート丈\n,\t膝丈\n,\tひざ丈\n,\t膝上\n,\t膝下\n,\tミモレ\n,\tミモレ丈\n,\tロング\n,\tロング丈\n,\tマキシ\n,\tマキシ丈\n,\t9分丈\n,\tアンクル丈\n,\t7分丈\n,\tミディアム丈\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t袖\n:\t袖なし\n,\t袖あり\n,\tノースリーブ\n,\t半袖\n,\t5分袖\n,\t五分袖\n,\t7分袖\n,\t七分袖\n,\t長袖\n,\tボリューム袖\n,\tドルマンスリーブ\n,\tパフスリーブ\n,\tフレアスリーブ\n,\tフレンチスリーブ\n,\tホルンスリーブ\n,\tドロップショルダー\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t首回り\n:\tVネック\n,\tUネック\n,\tラウンドネック\n,\tスクエアネック\n,\tカシュクール\n,\tホルターネック\n,\tハイネック\n,\tタートルネック\n,\tクルーネック\n,\tヘンリーネック\n,\tボートネック\n,\tオフショルダー\n,\tオフショル\n,\tワンショルダー\n,\tワンショル\n,\t襟付き\n,\t襟なし\n,\tスタンドカラー\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t形\n:\tAライン\n,\tIライン\n,\tプリンセス\n,\tプリンセスライン\n,\tエンパイア\n,\tエンパイアライン\n,\tマーメイド\n,\tマーメイドライン\n,\tスレンダー\n,\tスレンダーライン\n,\tベル\n,\tベルライン\n,\tトレーン\n,\tロングトレーン\n,\tタイト\n,\tスリム\n,\tペプラム\n,\tアシンメトリー\n,\t切り替えデザイン\n,\tドッキング\n,\tフレア\n,\tセミフレア\n,\t細身\n,\tパンツ\n,\tワイドパンツ\n,\tストレートパンツ\n,\tオールインワン\n,\tジャンプスーツ\n,\tセットアップ\n,\tセパレート\n,\t上下セット\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tデザイン\n:\tプリーツ\n,\tレース\n,\t刺繍\n,\tチュール\n,\tシフォン\n,\tフリル\n,\tリボン\n,\tフリンジ\n,\tベルト\n,\tウエストマーク\n,\tウエストリボン\n,\tバックリボン\n,\tスリット\n,\tサイドスリット\n,\tバックスリット\n,\tケープ\n,\tケープ風\n,\t切り替えデザイン\n,\tドッキング\n,\tバックシャン\n,\tバックコンシャス\n,\tファスナー\n,\tハイウエスト\n,\tウエストゴム\n,\tクロシェ\n,\t編み込み\n,\t透け感\n,\tシースルー\n,\t伸縮性\n,\tシャーリング\n,\t胸元\n,\t谷間\n,\t谷間魅せ\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t素材\n:\tポリエステル\n,\tファー\n,\tフェイクファー\n,\tベロア\n,\tベルベット\n,\t異素材MIX\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t素材\n:\tかわいい\n,\t大人可愛い\n,\tきれいめ\n,\tシンプル\n,\tカジュアル\n,\t大人\n,\t上品\n,\tおしゃれ\n,\tお洒落\n,\tかっこいい\n,\tレトロ\n,\tアジアン\n,\tエスニック\n,\tエキゾチック\n,\t大人可愛い\n,\t大人女子\n,\tこなれ感\n,\tラフ\n,\tメンズライク\n,\tマニッシュ\n,\tボーイッシュ\n,\tスポーティー\n,\tラブリー\n,\tキュート\n,\tガーリー\n,\tルーズ\n,\t個性的\n,\tクール\n,\tモード系\n,\tセクシー\n,\tエレガント\n,\tモダン\n,\t主役級\n,\t存在感\n,\tフォーマル\n,\tとろみ感\n,\t抜け感\n,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tイメージ\n:\tフォーマル\n,\tエレガント\n,\tかわいい\n,\t大人可愛い\n,\tきれいめ\n,\tシンプル\n,\tカジュアル\n,\tナチュラル\n,\tゴージャス\n,\t華やか\n,\t大人\n,\t上品\n,\tおしゃれ\n,\tお洒落\n,\tレトロ\n,\t主役級\n,\t存在感\n,\tクラシック\n,\t王道\n,\t主役級\n,\t存在感\n,\tラブリー\n,\tキュート\n,\tガーリー\n,\tお姫様\n,\tお嬢様\n,\t清楚\n,\t個性的\n,\tクール\n,\tモード系\n,\tセクシー\n,\tスタイリッシュ\n,\tモダン\n,\tかっこいい\n,\tマニッシュ\n,\tメンズライク\n,\tチャイナ\n,\tチャイナ風\n,\tエスニック\n,\tエキゾチック\n,\tアジアン\n,\tコスプレ\n,\tコスプレ風\n,\t,\t,\t;\t柄\n:\t無地\n,\t柄\n,\t花柄\n,\t小花柄\n,\tフラワー\n,\tドット柄\n,\t水玉\n,\tボーダー\n,\tストライプ\n,\tリーフ柄\n,\tボタニカル\n,\tチェック柄\n,\t格子柄\n,\t千鳥格子\n,\tグレンチェック\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t柄\n:\t無地\n,\t柄\n,\t花柄\n,\t小花柄\n,\tフラワー\n,\tドット柄\n,\t水玉\n,\tボーダー\n,\tストライプ\n,\tリーフ柄\n,\tボタニカル\n,\tチェック柄\n,\t格子柄\n,\t千鳥格子\n,\tグレンチェック\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t年代・性別\n:\t10代\n,\t20代\n,\t30代\n,\t40代\n,\t50代\n,\t60代\n,\tレディース\n,\tメンズ\n,\tペア\n,\t女性用\n,\t男性用\n,\t男女兼用\n,\tママ\n,\tマタニティ\n,\tキッズ\n,\t女の子\n,\t男の子\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t場所\n:\tオフィス\n,\tビジネス\n,\tOL\n,\t通勤\n,\t学生\n,\t通学\n,\tデート\n,\tお出かけ\n,\t公園デビュー\n,\t女子会\n,\tお泊まり\n,\t休日\n,\t運動\n,\tジム\n,\tヨガ\n,\tアウトドア\n,\tパーティー\n,\tイベント\n,\tリゾート\n,\t旅行\n,\t海\n,\tプール\n,\tリクルート\n,\t就活\n,\t海外\n,\t高原\n,\tホテル\n,\tガーデン\n,\tレストラン\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tその他\n:\t韓国\n,\t韓国系\n,\tオルチャン\n,\tファッション\n,\tコーデ\n,\tスタイル\n,\t体系カバー\n,\t二の腕カバー\n,\t美脚\n,\t脚長\n,\tプレゼント\n,\tギフト\n,\t新作\n,\t定番\n,\tプチプラ\n,\tモテ\n,\t激安\n,\t安い\n,\t送料無料\n,\t高見え\n,\t格上げ\n,\tトレンド\n,\t流行\n,\tインスタ映え\n,\t即納\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t季節・行事\n:\t春\n,\t夏\n,\t秋\n,\t冬\n,\tオールシーズン\n,\tシーズンレス\n,\tウェディング\n,\tブライダル\n,\t結婚式\n,\t二次会\n,\t2次会\n,\t1.5次会\n,\t披露宴\n,\tお呼ばれ\n,\t挙式\n,\t海外挙式\n,\t前撮り\n,\t後撮り\n,\tブライズメイド\n,\tパーティー\n,\tパーティ\n,\t成人式\n,\t入学式\n,\t入園式\n,\t卒業式\n,\t卒園式\n,\t謝恩会\n,\t演奏会\n,\t発表会\n,\tピアノ\n,\tハロウィン\n,\tクリスマス\n,\tステージ\n,\t舞台\n,\t演劇\n,\t撮影\n,\tスタジオ\n,\tキャバ\n,\tキャバクラ\n,\tキャバ嬢\n,\tラウンジ\n,\tクラブ\n,\t社交ダンス\n,\tラテンダンス\n,\tモダンダンス\n,\t2020\n;\tサイズ:\tサイズ\n,\tXXS\n,\tXS\n,\tS\n,\tM\n,\tL\n,\tXL\n,\t2XL\n,\t3XL\n,\t4XL\n,\t5XL\n,\t6XL\n,\t小さいサイズ\n,\t大きいサイズ\n,\tフリーサイズ\n,\t大きい\n,\t大きめ\n,\tビッグサイズ\n,\tぽっちゃり\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tカラー\n:\t色展開\n,\t白\n,\tホワイト\n,\t黒\n,\tブラック\n,\t赤\n,\tレッド\n,\t青\n,\tブルー\n,\t緑\n,\tグリーン\n,\t紫\n,\tパープル\n,\t茶色\n,\tブラウン\n,\t灰色\n,\tグレー\n,\t黄色\n,\tオフホワイト\n,\tベージュ\n,\tカーキ\n,\tイエロー\n,\tピンク\n,\tオレンジ\n,\t水色\n,\tワインレッド\n,\tネイビー\n,\t金色\n,\t銀色\n,\tゴールド\n,\tシルバー\n,\tパステルカラー\n,\tくすみカラー\n,\t大人カラー\n,\tベイクドカラー\n,\tバイカラー\n,\tモノトーン\n,\t春カラー\n,\t秋カラー\n,\tニュアンスカラー\n,\tカラバリ\n,\t光沢\n,\tメタリック\n,\t,\t,\t";
const DEFAULT_TEMPLATE_5 =
    "自由記入:\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t大\n:\t水着\n,\tビキニ\n,\tスイムウェア\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t中\n:\tタンキニ\n,\tモノキニ\n,\tバンドゥビキニ\n,\t紐ビキニ\n,\t三角ビキニ\n,\tマイクロビキニ\n,\tブラジリアンビキニ\n,\tワンピース水着\n,\tフィットネス水着\n,\t競泳水着\n,\tセクシービキニ\n,\t体系カバー水着\n,\tラッシュガード\n,\tラッシュパーカー\n,\tショートパンツ\n,\tハーフパンツ\n,\t短パン\n,\tレギンス\n,\tトレンカ\n,\tスカパン\n,\t羽織り\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t形\n:\tワンピース\n,\tセパレート\n,\tビスチェ\n,\tバンドゥ\n,\tハイネック\n,\tホルターネック\n,\tオフショルダー\n,\tオフショル\n,\tワンショルダー\n,\tワンショル\n,\tワイヤー\n,\tノンワイヤー\n,\tパッド付き\n,\tパッド無し\n,\t紐\n,\t三角\n,\tブラジリアン\n,\tTバック\n,\tクロス\n,\tクロスバンド\n,\t体系カバー\n,\t二の腕カバー\n,\tハイレグ\n,\tローリング\n,\t半袖\n,\t長袖\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tデザイン:\tリボン\n,\tレース\n,\t刺繍\n,\tチュール\n,\tシフォン\n,\tフリル\n,\tレースアップ\n,\tステッチ\n,\tフリンジ\n,\tベルト\n,\tウエストマーク\n,\tウエストリボン\n,\tバックリボン\n,\tスリット\n,\t切り替えデザイン\n,\tドッキング\n,\tバックシャン\n,\tバックコンシャス\n,\tハイウエスト\n,\tニット\n,\tクロシェ\n,\t編み込み\n,\t透け感\n,\tシースルー\n,\t伸縮性\n,\tシャーリング\n,\t胸元\n,\t谷間\n,\t谷間魅せ\n,\t盛れる\n,\t日焼け防止\n,\tUVカット\n,\t紫外線対策\n,\tメッシュ\n,\tメッシュ素材\n,\tジップアップ\n,\t水陸両用\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tセット\n:\tセット\n,\t上下セット\n,\t2点セット\n,\t3点セット\n,\t4点セット\n,\t5点セット\n,\t6点セット\n,\tツーピース\n,\tスリーピース\n,\tお得\n,\t2way\n,\t3way\n,\t4way\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tイメージ\n:\tかわいい\n,\t大人可愛い\n,\tきれいめ\n,\tセクシー\n,\t\n,\tシンプル\n,\tカジュアル\n,\tナチュラル\n,\tゴージャス\n,\t華やか\n,\t大人\n,\t大人っぽい\n,\tおしゃれ\n,\tお洒落\n,\tレトロ\n,\t主役級\n,\t存在感\n,\t女っぽ\n,\tラブリー\n,\tキュート\n,\tガーリー\n,\t個性的\n,\tクール\n,\tモード系\n,\tスタイリッシュ\n,\tモダン\n,\tかっこいい\n,\tマニッシュ\n,\tメンズライク\n,\tエスニック\n,\tエキゾチック\n,\tアジアン\n,\tコスプレ\n,\tコスプレ風\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t柄\n:\t無地\n,\t柄\n,\t花柄\n,\t小花柄\n,\tフラワー\n,\tチェック柄\n,\t格子柄\n,\t千鳥格子\n,\tグレンチェック\n,\tドット柄\n,\t水玉\n,\tボーダー\n,\tストライプ\n,\tヒョウ柄\n,\tレオパード\n,\tセブラ柄\n,\t牛柄\n,\tアニマル柄\n,\tリーフ柄\n,\tボタニカル\n,\tプリント\n,\tキャラクター\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\t季節・行事\n:\t10代\n,\t20代\n,\t30代\n,\t40代\n,\t50代\n,\t60代\n,\tレディース\n,\tメンズ\n,\t女性用\n,\t男性用\n,\tママ\n,\tマタニティ\n,\tミセス\n,\t女の子\n,\tカップル\n,\tペア\n,\tペアコーデ\n,\tペアルック\n,\tお揃い\n,\t春\n,\t夏\n,\t海\n,\tビーチ\n,\tプール\n,\tリゾート\n,\t旅行\n,\tスポーツ\n,\tヨガ\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tその他\n:\t体系カバー\n,\t二の腕カバー\n,\t美脚\n,\t脚長\n,\t着痩せ\n,\tスタイルアップ\n,\t美スタイル\n,\t韓国\n,\t韓国系\n,\tオルチャン\n,\tファッション\n,\tコーデ\n,\tスタイル\n,\t高見え\n,\t格上げ\n,\tプレゼント\n,\tギフト\n,\t新作\n,\t定番\n,\tプチプラ\n,\tモテ\n,\t激安\n,\t安い\n,\t送料無料\n,\tトレンド\n,\t流行\n,\tインスタ映え\n,\t即納\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t;\tサイズ\n:\tサイズ\n,\tXXS\n,\tXS\n,\tS\n,\tM\n,\tL\n,\tXL\n,\t2XL\n,\t3XL\n,\t4XL\n,\t5XL\n,\t6XL\n,\t小さいサイズ\n,\t大きいサイズ\n,\tフリーサイズ\n,\t大きい\n,\t大きめ\n,\tビッグサイズ\n,\tぽっちゃり\n,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t,\t";
const DEFAULT_ITEMS = "バスト,\tウェスト,\tヒップ,\t肩幅,\t袖丈,\t袖口,\tスカート丈,\t縦,\t横,\t厚さ,\tストラップ長さ,\t裾丈,\tズボン丈";
const DEFAULT_COLORS =
    "白,\tホワイト,\t黒,\tブラック,\t赤,\tレッド,\t青,\tブルー,\t緑,\tグリーン,\t紫,\tパープル,\t茶色,\tブラウン,\t灰色,\tグレー,\t黄色,\tオフホワイト,\tベージュ,\tカーキ,\tイエロー,\tピンク,\t藍色,\tオレンジ,\t水色,\tワインレッド,\tネイビー,\t金色,\t銀色,\tゴールド,\tシルバー,\tパステルカラー,\tくすみカラー,\t大人カラー,\tベイクドカラー,\tバイカラー,\tモノトーン,\t春カラー,\t秋カラー,\tニュアンスカラー,\tカラバリ,\tミリタリー,\t光沢,\tメタリック,\tアプリコット";

const pool = new Pool({
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PSW || "thebase",
    database: process.env.POSTGRES_DB || "thebase",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
});

const app = express();

const init = () => {
    pool.query(`CREATE TABLE IF NOT EXISTS users
        (
            email           VARCHAR(50) NOT NULL,
            descriptions    TEXT[],
            items           TEXT,
            colors          TEXT,
            header          TEXT,
            footer          TEXT,
            subscription    VARCHAR(30)
        )
    `);
    pool.query(`CREATE TABLE IF NOT EXISTS bots
        (
            owner           VARCHAR(50) NOT NULL,
            email           VARCHAR(50) NOT NULL,
            password        VARCHAR(128),
            descriptions    TEXT[],
            items           TEXT,
            colors          TEXT,
            header          TEXT,
            footer          TEXT,
            owner_refresh_token    VARCHAR(32) NOT NULL,
            subscription    VARCHAR(30),
            token           VARCHAR(32) NOT NULL,
            status          boolean
        )
    `)
};

init();

const mailSender = (email, text) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vulpeswhiteint98@gmail.com',
            pass: 'qinnfhobeqpebvsz'
        }
    });

    const mailOptions = {
        from: 'vulpeswhiteint98@gmail.com',
        to: email,
        subject: 'Invite',
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const isBot = async (authHeader) => {
    if (authHeader !== undefined) {
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.decode(token, "Oriental Wind");
        if (decoded) {
            try {
                const queryResult = await pool.query(`SELECT * FROM bots WHERE email = '${decoded.email}'`);
                if (queryResult.rowCount > 0) {
                    return queryResult.rows[0];
                }
                return null;
            } catch (e) {
                return null;
            }
        } else return null;
    }
    return null;
}

app.get("/descriptions", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const bot_data = await isBot(authHeader);
    let table = "users";
    if (bot_data) table = "bots";
    pool.query(`SELECT descriptions FROM ${table} WHERE email = '${req.query.email}'`, (error, result) => {
        let descriptions = [];
        if (
            !error &&
            result.rows.length !== 0 &&
            result.rows[0].descriptions !== null &&
            result.rows[0].descriptions.length !== 0 &&
            result.rows[0].descriptions[req.query.no] !== undefined &&
            result.rows[0].descriptions[req.query.no] !== ""
        )
            result.rows[0].descriptions[req.query.no]
                .split(";\t")
                .forEach((t) => descriptions.push({ header: t.split(":\t")[0], keywords: t.split(":\t")[1].split(",\t") }));
        res.json({ descriptions });
    });
});

app.post("/descriptions", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const bot_data = await isBot(authHeader);
    let table = "users";
    if (bot_data) table = "bots";
    pool.query(
        `UPDATE ${table} SET descriptions[${req.body.no}] = '${req.body.data.map((t) => `${t.header}:\t${t.keywords.join(",\t")}`).join(";\t")}' WHERE email='${req.body.email
        }'`,
        (error) => {
            if (error) return res.status(400).json({ error });
            res.json({ saved: true });
        }
    );
});

app.get("/me", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const bot_data = await isBot(authHeader);
    axios
        .get("https://api.thebase.in/1/users/me", {
            headers: {
                Authorization: `Bearer ${req.query.accessToken}`,
            },
        })
        .then((response) => {
            if (bot_data) {
                return res.status(200).json({
                    result: "success",
                    user: {
                        mail_address: bot_data.email
                    }
                })
            }
            return res.status(200).json({
                result: "success",
                user: response.data.user,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                result: "failure",
                error,
            });
        });
});

app.post("/credentials", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const accessToken = req.body.accessToken;
    let refreshToken = req.body.refreshToken;
    const authorizationCode = req.body.authorizationCode;
    const bot_data = await isBot(authHeader);
    if (bot_data) refreshToken = bot_data.owner_refresh_token;
    axios
        .get("https://api.thebase.in/1/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(() => {
            return res.status(200).json({
                /*result: "success"*/
            });
        })
        .catch(() => {
            axios
                .post(
                    "https://api.thebase.in/1/oauth/token",
                    {},
                    {
                        params: {
                            grant_type: "refresh_token",
                            client_id: `${process.env.CLIENT_ID || "6cd00fb8ffcab2dec0d1f10f7096b697"}`,
                            client_secret: `${process.env.CLIENT_SECRET || "1155fba3aa930f860d3436b84fbc06d0"}`,
                            refresh_token: refreshToken,
                            redirect_uri: `${process.env.APP_URL || "http://localhost:3000"}/redirect`,
                        },
                    }
                )
                .then((response) => {
                    return res
                        .status(201)
                        .json({ /*refresh_type: "token",*/ accessToken: response.data.access_token, refreshToken: response.data.refresh_token });
                })
                .catch(() => {
                    axios
                        .post(
                            "https://api.thebase.in/1/oauth/token",
                            {},
                            {
                                params: {
                                    grant_type: "authorization_code",
                                    client_id: `${process.env.CLIENT_ID || "6cd00fb8ffcab2dec0d1f10f7096b697"}`,
                                    client_secret: `${process.env.CLIENT_SECRET || "1155fba3aa930f860d3436b84fbc06d0"}`,
                                    code: authorizationCode,
                                    redirect_uri: `${process.env.APP_URL || "http://localhost:3000"}/redirect`,
                                },
                            }
                        )
                        .then((response) => {
                            return res.status(201).json({
                                /*refresh_type: "authorization_code",*/ accessToken: response.data.access_token,
                                refreshToken: response.data.refresh_token,
                            });
                        })
                        .catch((err) => {
                            console.log(err.mess);
                            res.status(400).json({
                                /*result: "failure"*/
                            });
                        });
                });
        });
});

app.get("/product", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const bot_data = await isBot(authHeader);
    let table = "users";
    if (bot_data) table = "bots";
    pool.query(`SELECT items, colors, header, footer FROM ${table} WHERE email = '${req.query.email}'`, (error, result) => {
        if (error && result.rows.length === 0) return res.status(404).json({ error });
        res.json({ productInfo: result.rows[0] });
    });
});

app.post("/product/info", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const bot_data = await isBot(authHeader);
    let table = "users";
    if (bot_data) table = "bots";
    pool.query(`SELECT * FROM ${table} WHERE email = '${req.body.email}'`, (error, result) => {
        if (error || result.rows.length === 0) return res.status(404).json({ error });
        pool.query(
            `UPDATE ${table} SET items = '${req.body.itemList.join(",\t")}', colors = '${req.body.colorList.join(",\t")}', header = '${req.body.header
            }', footer = '${req.body.footer}' WHERE email = '${req.body.email}'`,
            (error) => {
                if (error) return res.status(400).json({ error });
                res.json({
                    /*result: "success"*/
                });
            }
        );
    });
});

app.post("/product/header-footer", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const bot_data = await isBot(authHeader);
    let table = "users";
    if (bot_data) table = "bots";
    pool.query(`SELECT * FROM ${table} WHERE email = '${req.body.email}'`, (error, result) => {
        if (error || result.rows.length === 0) return res.status(404).json({ error });
        pool.query(`UPDATE ${table} SET header = '${req.body.header}', footer = '${req.body.footer}' WHERE email = '${req.body.email}'`, (error) => {
            if (error) return res.status(400).json({ error });
            res.json({
                /*result: "success"*/
            });
        });
    });
});

app.post("/product", async (req, res) => {
    const variations = req.body.variations === undefined ? [] : req.body.variations;

    try {
        const response = await axios.post(
            "https://api.thebase.in/1/items/add",
            {},
            {
                headers: {
                    Authorization: `Bearer ${req.body.accessToken}`,
                },
                params: {
                    title: req.body.title,
                    price: Math.max(req.body.price, 50),
                    identifier: req.body.identifier,
                    stock: req.body.stock || 0,
                    visible: process.env.MODE === "LIVE" ? 1 : 0,
                },
            }
        );

        await axios.post(
            "https://api.thebase.in/1/items/edit",
            {},
            {
                headers: {
                    Authorization: `Bearer ${req.body.accessToken}`,
                },
                params: {
                    item_id: response.data.item.item_id,
                    detail: req.body.detail,
                },
            }
        );

        let sliced = [];

        for (let i = 0; i < variations.length; i += 14) {
            sliced = variations.slice(i, i + 14);
            if (sliced.length !== 0) {
                let variationObject = {};
                sliced.forEach((t, idx) => {
                    variationObject[`variation_id[${idx}]`] = "";
                    variationObject[`variation[${idx}]`] = t.name;
                    variationObject[`variation_stock[${idx}]`] = t.stock;
                });

                await axios.post(
                    "https://api.thebase.in/1/items/edit",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${req.body.accessToken}`,
                        },
                        params: {
                            item_id: response.data.item.item_id,
                            ...variationObject,
                        },
                    }
                );
            }
        }

        return res.json({
            /*result:"success"*/
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            /*result: "failure"*/
        });
    }
});

app.get("/stripe/success", async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const bot_auth_token = req.query.bot_auth_token;
    const bot_data = await isBot(bot_auth_token);
    let table = "users";
    if (bot_data) table = "bots";
    pool.query(`SELECT * FROM ${table} WHERE email = '${session.customer_email}'`, (error, result) => {
        if (error) return res.redirect(`${process.env.APP_URL || "http://localhost:3000"}?backend_error`);
        if (result.rows.length === 0) {
            pool.query(
                `INSERT INTO ${table}(email, descriptions, items, colors, header, footer, subscription) VALUES ('${session.customer_email}', '{"${DEFAULT_TEMPLATE_1}", "${DEFAULT_TEMPLATE_2}", "${DEFAULT_TEMPLATE_3}", "${DEFAULT_TEMPLATE_4}", "${DEFAULT_TEMPLATE_5}", "", "", "", "", ""}', '${DEFAULT_ITEMS}', '${DEFAULT_COLORS}', '', '', '${session.subscription}')`,
                (error) => {
                    if (error) return res.redirect(`${process.env.APP_URL || "http://localhost:3000"}?backend_error`);
                    res.redirect(process.env.APP_URL || "http://localhost:3000");
                }
            );
        } else if (bot_data && bot_data.subscription === '') {
            pool.query(
                `UPDATE bots SET subscription = '${session.subscription}' WHERE email = '${bot_data.email}'`, (err, result) => {
                    if (error) return res.redirect(`${process.env.APP_URL || "http://localhost:3000"}?backend_error`);
                    res.redirect(process.env.APP_URL || "http://localhost:3000");
                });
        }
        else {
            pool.query(
                `UPDATE users SET descriptions = '{"${DEFAULT_TEMPLATE_1}", "${DEFAULT_TEMPLATE_2}", "${DEFAULT_TEMPLATE_3}", "${DEFAULT_TEMPLATE_4}", "${DEFAULT_TEMPLATE_5}", "", "", "", "", ""}', items = '${DEFAULT_ITEMS}', colors = '${DEFAULT_COLORS}', header = '', footer = '', subscription = '${session.subscription}' WHERE email = '${session.customer_email}'`,
                (error) => {
                    if (error) return res.redirect(`${process.env.APP_URL || "http://localhost:3000"}?backend_error`);
                    res.redirect(process.env.APP_URL || "http://localhost:3000");
                }
            );
        }
    });
});

app.post("/stripe/check", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const bot_data = await isBot(authHeader);
    let table = "users";
    if (bot_data) table = "bots";
    pool.query(`SELECT subscription FROM ${table} WHERE email = '${req.body.email}'`, async (error, result) => {
        if (error || result.rows.length === 0 || result.rows[0].subscription === null || result.rows[0].subscription === "") return res.status(404).json({ error });
        const subscription = await stripe.subscriptions.retrieve(result.rows[0].subscription);
        if (subscription.current_period_end < Math.floor(Date.now() / 1000)) res.json({ result: "failure" });
        else res.json({ result: "success", interval: subscription.plan.interval });
    });
});

app.post("/invite", async (req, res) => {
    const randomBytes = crypto.randomBytes(16);
    const iCode = randomBytes.toString('hex');
    const email = req.body.email;
    const refreshToken = req.body.owner_refresh_token;
    const owner_email = req.body.owner_email;

    try {
        // Check if email exists in invitation table
        let queryResult = await pool.query('SELECT * FROM bots WHERE email = $1', [email]);
        const ownerInfo = await pool.query('SELECT * FROM users WHERE email = $1', [owner_email]);

        if (ownerInfo.rowCount === 0) return res.status(404).json({ error: 'Not Found' });
        const owner = ownerInfo.rows[0];
        if (queryResult.rowCount === 0) {
            queryResult = await pool.query('INSERT INTO bots (owner, email, password, descriptions, items, colors, header, footer, owner_refresh_token, subscription, token, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                [owner_email, email, "", owner.descriptions, owner.items, owner.colors, owner.header, owner.footer, refreshToken, "", iCode, true]);

            const inviteLink = (process.env.APP_URL || 'http://localhost:3000') + '/invited/' + iCode;

            if (mailSender(email, inviteLink)) {
                return res.json({ invited: 1 });
            } else {
                return res.json({ invited: 3 });
            }
        } else {
            return res.json({ invited: 2 });
        }
    } catch (error) {
        console.log("onwer info: ", error);
        return res.status(500).json({ error: error.message });
    }
});

app.get("/invited/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const queryResult = await pool.query(`SELECT * FROM bots WHERE token = '${id}'`);
        if (queryResult.rowCount === 0) return res.json({ info: "Invalid" });
        if (queryResult.rows[0].status === false) return res.json({ info: "already registered" });
        return res.json({ info: "okay", email: queryResult.rows[0].email });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.mess
        })
    }
});

app.get("/getBots", async (req, res) => {
    pool.query(`SELECT * FROM bots WHERE owner = '${req.query.email}'`, async (error, result) => {
        if (error) return res.status(404).json({ error });
        let resultData = [];
        for (let i = 0; i < result.rowCount; i++) {
            resultData.push({ email: result.rows[i].email });
        }
        return res.json({ result: "success", bots: resultData });
    });
});

app.get("/deleteBots", async (req, res) => {
    const email = req.query.email;
    const owner = req.query.owner;
    try {
        const queryResult = pool.query(`DELETE FROM bots WHERE owner='${owner}' AND email='${email}'`);
        return res.status(200).json({ status: 'okay' }); 
    } catch (err) {
        return res.status(400).json({ error: err.mess });
    }
})

const passwordHasher = async (password) => {
    const hashPassword = await bcrypt.hash(password, '$2b$10$dITd5TEsPX/x7F2MF3Z5w.');
    return hashPassword;
}

app.post("/bots/signup", async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    const hashPassword = await passwordHasher(password);
    try {
        const queryResult = await pool.query(`SELECT * FROM bots WHERE email = '${email}'`);
        if (queryResult.rowCount > 0 && queryResult.rows[0].status === true) {
            pool.query(`UPDATE bots SET password = '${hashPassword}', status = ${false} WHERE email = '${email}'`);
            const token = jwt.sign({ email: email }, "Oriental Wind");
            return res.json({ status: "okay", token: token });
        } else {
            return res.json({ status: "warn", error: "already signed up" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.mess });
    }
});

app.post("/bots/signin", async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    const queryResult = await pool.query(`SELECT * FROM bots WHERE email = '${email}'`);
    if (queryResult.rowCount > 0) {
        const hashPassword = await passwordHasher(password);
        if (queryResult.rows[0].password === hashPassword) {
            const token = jwt.sign({ email: email }, "Oriental Wind");
            return res.json({ status: "okay", token: token });
        }
        else return res.json({ status: "no" });
    }
    else return res.json({ status: "not found" });
});

app.get('/checkAuthentication', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.decode(token, "Oriental Wind");
    if (decoded) {
        res.json({ status: 'authorized' });
    } else res.json({ status: 'unauthorized' });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server running at port ${process.env.PORT || 5000}`);
});
