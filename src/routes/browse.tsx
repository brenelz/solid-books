// Live-SSR spelling of the homepage. `/` is prerendered to a static file,
// and a static host serves that file for every query string, so hard loads
// of `/?page=2` are sent here instead (see Document.tsx).
export { default, route } from "./index";
