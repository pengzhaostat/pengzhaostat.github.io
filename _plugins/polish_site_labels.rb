# frozen_string_literal: true

module PengZhaoSiteLabels
  REPLACEMENTS = {
    '>news</a>' => '>News</a>',
    '>selected publications</a>' => '>Selected Publications</a>',
    '<span class="nav-link">ctrl k ' => '<span class="nav-link">'
  }.freeze

  def self.apply(html)
    REPLACEMENTS.reduce(html) { |output, (source, replacement)| output.gsub(source, replacement) }
  end
end

Jekyll::Hooks.register :pages, :post_render do |page|
  next unless page.output_ext == '.html'

  page.output = PengZhaoSiteLabels.apply(page.output)
end
