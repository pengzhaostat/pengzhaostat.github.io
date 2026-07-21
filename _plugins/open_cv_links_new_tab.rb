# frozen_string_literal: true

module PengZhaoSite
  CV_PDF_URL = 'https://pengzhaostat.github.io/assets/pdf/Peng_Zhao_CV.pdf'
  CV_ICON_LINK = %r{<a\b(?=[^>]*\bhref=(["'])#{Regexp.escape(CV_PDF_URL)}\1)(?=[^>]*\btitle=(["'])Cv pdf\2)[^>]*>}i

  def self.open_cv_icons_in_new_tab(html)
    html.gsub(CV_ICON_LINK) do |anchor|
      next anchor if anchor.match?(/\btarget=/i)

      anchor.sub('>', ' target="_blank" rel="noopener noreferrer">')
    end
  end
end

Jekyll::Hooks.register :pages, :post_render do |page|
  next unless page.output_ext == '.html'

  page.output = PengZhaoSite.open_cv_icons_in_new_tab(page.output)
end
