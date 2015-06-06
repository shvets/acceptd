require "acceptd/routes_base"

class Acceptd::FileBrowserRoutes < Acceptd::RoutesBase

  get "/file_browser/tree" do
    content_type :json

    tree = []

    id = params[:id]

    if id
      directories(id).each do |dir|
        tree << process_node(dir)
      end
    end

    tree.to_json
  end

  get "/file_browser/node" do
    content_type :json

    id = params[:id]

    (id ? process_node(id) : nil).to_json
  end

  private

  def directories root
    Dir.glob("#{root}/*").select { |f| File.directory? f }.map { |f| f.gsub("//", "/") }
  end

  def process_node file
    {
        id: File.path(file),
        name: File.basename(file),
        hasChildren: File.directory?(file)
    }
  end
end
