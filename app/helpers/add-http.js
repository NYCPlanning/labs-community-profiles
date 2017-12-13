import { helper } from '@ember/component/helper';

export function addHttp(params) {
  let [ url ] = params;
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}

export default helper(addHttp);
