export function validate($) {
  return {
    rule: 'include-meta-description',
    title: 'Include a meta tag that describes the content of the page',
    check: $("head meta[name=description]").attr("content") != null,  
    source: 'internal'
  };
}
