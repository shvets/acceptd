require "acceptd/routes_base"

class Acceptd::FileBrowserRoutes < Acceptd::RoutesBase

  get "/file_browser/tree" do
    content_type :json

    if params[:id] == "1"
      tree = []

      directories('/').each do |dir|
        tree << process_node(dir)
      end

      tree.to_json
    else
      tree = []

      directories(params[:id]).each do |dir|
        tree << process_node(dir)
      end

      tree.to_json
    end
  end

  private

  def directories root
    Dir.glob("#{root}/*").select { |f| File.directory? f }.map { |f| f.gsub("//", "/") }
  end

  def process_node file
    {
        id: File.path(file),
        name: File.basename(file),
        text: File.basename(file),
        type: File.path(file) == ENV['HOME'] ? "home_folder" : "folder",
        state: {
            opened: false,
            disabled: false,
            selected: false
        },
        li_attr: {
            base: File.path(file),
            isLeaf: !File.directory?(file)
        },
        children: File.directory?(file),
        hasChildren: File.directory?(file)
    }
  end
end
