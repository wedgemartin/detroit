
// Detroit.
// Sup.

package com.shutdown;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ResourceBundle;
import java.lang.Object;
import java.util.Scanner;
import java.io.FileReader;
import java.io.File;
import java.io.FileFilter;

import javax.servlet.ServletException;
import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.HiddenFileFilter;
import org.mozilla.javascript.*;
import com.mongodb.*;


public class Detroit extends HttpServlet {

    // public static final Context cx = Context.enter();
    // public static final Scriptable scope = cx.initStandardObjects();
    private static Context cx;
    private static Scriptable scope;
    private final static String scopeLabel = "Detroit";
    protected String mongo_host = null;

    public void init(ServletConfig servletConfig) throws ServletException {
       cx = Context.enter();
       scope = cx.initStandardObjects();
       System.out.println("Starting Detroit...");
       this.mongo_host = servletConfig.getInitParameter("myParam");
       parseFiles();
       // Set up MongoDB handle.
       String mhost = "localhost";
       String mport = "27017";
       if ( this.mongo_host != null && this.mongo_host.indexOf(":") != -1 ) {
          String[] mparts = this.mongo_host.split(":");
          mhost = mparts[0];
          mport = mparts[1];
       } else if ( this.mongo_host != null ) {
          mhost = this.mongo_host;
       }
       MongoClient mongoClient = new MongoClient(mhost, Integer.parseInt(mport));
       Object o = scope.get("detroit_init", scope);
       Object functionArgs[] = { mongoClient };
       org.mozilla.javascript.Function f = (org.mozilla.javascript.Function)o;
       Object result = f.call(cx, scope, scope, functionArgs);
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
       cx = Context.enter();
       if ( request.getParameter("debug") != null ) {
          System.out.println("Debug flag set to true. Rebuilding JS codebase.");
          parseFiles();
       }
       Object jsObj = scope.get("handleRequest", scope);
       if (!(jsObj instanceof org.mozilla.javascript.Function)) {
           System.out.println("Cannot find handleRequest function!");
       } else {
           PrintWriter out = response.getWriter();
           Object functionArgs[] = { request.getRequestURI(), request.getQueryString(), out };
           org.mozilla.javascript.Function f = (org.mozilla.javascript.Function)jsObj;
           Object result = f.call(cx, scope, scope, functionArgs);
           // String report = "f('request') = " + Context.toString(result);
           // System.out.println(report);
           // response.setContentType("text/html");
           // response.setCharacterEncoding("UTF-8");
           // out.println(report);
       }
    }

    private String[] listFilesForFolder(final File folder) {
       String[] results = new String[128];
       Integer i = 0;
       for (final File fileEntry : folder.listFiles((FileFilter) HiddenFileFilter.VISIBLE)) {
           if (fileEntry.isDirectory()) {
              String[] subfiles = listFilesForFolder(fileEntry);
              for ( int j = 0; j < subfiles.length; j++ ) {
                 results[i] = subfiles[j];
                 i++;
              }
           } else {
              results[i] = fileEntry.getAbsolutePath();
              i++;
              System.out.println(fileEntry.getAbsolutePath());
           }
       }
       return results;
    }
    

    private void parseFiles() {
       try {
          FileReader fr = new FileReader("js/routes.js");
          cx.evaluateReader(scope, fr, scopeLabel, 1, null);
          FileReader fa = new FileReader("js/api.js");
          cx.evaluateReader(scope, fa, scopeLabel, 1, null);
          // Now iterate through the controllers, models, and lib dir.
          File controller_folder = new File("js/controllers");
          String[] controller_files = listFilesForFolder(controller_folder);
          for ( int c = 0; c < controller_files.length; c++ ) {
             if ( controller_files[c] != null ) {
                System.out.println("Loading file: " + controller_files[c]);
                FileReader fc = new FileReader(controller_files[c]);
                cx.evaluateReader(scope, fc, scopeLabel, 1, null);
             }
          }
          File lib_folder = new File("js/lib");
          String[] lib_files = listFilesForFolder(lib_folder);
          for ( int l = 0; l < lib_files.length; l++ ) {
             if ( lib_files[l] != null ) {
                System.out.println("Loading file: " + lib_files[l]);
                FileReader fl = new FileReader(lib_files[l]);
                cx.evaluateReader(scope, fl, scopeLabel, 1, null);
             }
          }
          File model_folder = new File("js/models");
          String[] model_files = listFilesForFolder(model_folder);
          for ( int m = 0; m < model_files.length; m++ ) {
             if ( model_files[m] != null ) {
                System.out.println("Loading file: " + model_files[m]);
                FileReader fm = new FileReader(model_files[m]);
                cx.evaluateReader(scope, fm, scopeLabel, 1, null);
             }
          }
       } catch ( Exception e ) {
          System.out.println("Unable to process Detroit files: " + e);
       }
    }

}


