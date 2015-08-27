require "acceptd/routes_base"

class Acceptd::CommonRoutes < Acceptd::RoutesBase

  # https://github.com/mongrelion/carlosleon.info/blob/master/articles/angular-sinatra-html5mode.markdown
  get '/*' do
    send_file File.join(settings.public_dir, '/app/acceptd/index.html')
  end

  # get "*" do
  #   status 404
  # end
  #
  # delete "*" do
  #   status 404
  # end
  #
  # not_found do
  #   json_status 404, "Not found"
  # end

  error do
    json_status 500, env['sinatra.error'].message
  end

  private

  def json_status(code, reason)
    status code

    { :status => code, :reason => reason }.to_json
  end

end
