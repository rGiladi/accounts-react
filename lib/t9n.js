import { T9n } from 'meteor-accounts-t9n'
import 'meteor-accounts-t9n/build/ar';
import 'meteor-accounts-t9n/build/ca';
import 'meteor-accounts-t9n/build/cs';
import 'meteor-accounts-t9n/build/da';
import 'meteor-accounts-t9n/build/de';
import 'meteor-accounts-t9n/build/el';
import 'meteor-accounts-t9n/build/en';
import 'meteor-accounts-t9n/build/es';
import 'meteor-accounts-t9n/build/es_ES';
import 'meteor-accounts-t9n/build/es_ES_formal';
import 'meteor-accounts-t9n/build/es_formal';
import 'meteor-accounts-t9n/build/et';
import 'meteor-accounts-t9n/build/fa';
import 'meteor-accounts-t9n/build/fi';
import 'meteor-accounts-t9n/build/fr';
import 'meteor-accounts-t9n/build/fr_CA';
import 'meteor-accounts-t9n/build/he';
import 'meteor-accounts-t9n/build/hr';
import 'meteor-accounts-t9n/build/hu';
import 'meteor-accounts-t9n/build/id';
import 'meteor-accounts-t9n/build/it';
import 'meteor-accounts-t9n/build/ja';
import 'meteor-accounts-t9n/build/kh';
import 'meteor-accounts-t9n/build/ko';
import 'meteor-accounts-t9n/build/nl';
import 'meteor-accounts-t9n/build/no_NB';
import 'meteor-accounts-t9n/build/pl';
import 'meteor-accounts-t9n/build/pt';
import 'meteor-accounts-t9n/build/pt_PT';
import 'meteor-accounts-t9n/build/ro';
import 'meteor-accounts-t9n/build/ru';
import 'meteor-accounts-t9n/build/sk';
import 'meteor-accounts-t9n/build/sl';
import 'meteor-accounts-t9n/build/sv';
import 'meteor-accounts-t9n/build/th';
import 'meteor-accounts-t9n/build/uk';
import 'meteor-accounts-t9n/build/vi';
import 'meteor-accounts-t9n/build/zh_CN';
import 'meteor-accounts-t9n/build/zh_HK';
import 'meteor-accounts-t9n/build/zh_TW';

const supportedLanguages = ['ar', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'es_ES', 'es_ES_formal', 'es_formal', 'et', 'fa', 'fi', 'fr', 'fr_CA', 'he', 'hr', 'hu', 'id', 'it', 'ja', 'kh', 'ko', 'nl', 'no_NB', 'pl', 'pt', 'pt_PT', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi', 'zh_CN', 'zh_HK', 'zh_TW'];

export const setLanguage = (language) => {
  if (language && supportedLanguages.includes(language)) T9n.setLanguage(language);
  else console.error(`language ${language} is not among supported languages.`);
}