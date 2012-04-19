
 * To use appengine deploy target specify
    appengine.sdk variable in user.properties file.

 * To override output dir specify output.dir variable
   in user.properties file.

 * Targets:

    - prepare-deploy -- prepare deploy into ${output.dir}
      (you even don't need appengine sdk)

    - deploy -- prepare deploy and do update with version
      specified in war/WEB-INF/appengine-web.xml

    - runserver -- run test server locally

    - clean -- clean up ${output.dir} directory