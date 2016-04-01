
// Detroit.
// Sup.

package com.shutdown;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ResourceBundle;
import java.lang.Object;
import java.util.Scanner;
import java.util.Map;
import java.util.LinkedHashMap;
import java.io.FileReader;
import java.io.File;
import java.io.FileFilter;
import java.io.BufferedReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

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
       Object jsObj = scope.get("handleRequest", scope);
       if (!(jsObj instanceof org.mozilla.javascript.Function)) {
           System.out.println("Cannot find handleRequest function!");
       } else {
           PrintWriter out = response.getWriter();
           System.out.println(" Processing " + request.getMethod() + " request");
           if ( request.getMethod().equals("POST") ) {
              System.out.println("In post...");
              StringBuffer buffer = new StringBuffer();
              BufferedReader reader = request.getReader();
              String line;
              while ((line = reader.readLine()) != null) {
                  buffer.append(line);
              }
              String data = buffer.toString();
              System.out.println("  DATA HERE IS: " + data);
              // Check to see if the data is in query param format so we can reload files if debug is passed in 
              try {
                 Map m = splitQuery(data);
                 if ( m.get("debug") != null ) {
                    System.out.println("Debug flag set to true. Rebuilding JS codebase.");
                    parseFiles();
                 }
              } catch ( Exception e ) {
                 // Nihil
              }
              Object functionArgs[] = { request.getRequestURI(), request.getQueryString(), out, request.getMethod(), data };
              org.mozilla.javascript.Function f = (org.mozilla.javascript.Function)jsObj;
              Object result = f.call(cx, scope, scope, functionArgs);
           } else if ( request.getMethod().equals("GET") ) {
              if ( request.getParameter("debug") != null ) {
                 System.out.println("Debug flag set to true. Rebuilding JS codebase.");
                 parseFiles();
              }
              System.out.println("In get...");
              Object functionArgs[] = { request.getRequestURI(), request.getQueryString(), out, request.getMethod(), null };
              org.mozilla.javascript.Function f = (org.mozilla.javascript.Function)jsObj;
              Object result = f.call(cx, scope, scope, functionArgs);
           }
           // response.setContentType("text/html");
           // response.setCharacterEncoding("UTF-8");
           // out.println(report);
       }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
       doGet(request, response);
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

    public static Map<String, String> splitQuery(String data) throws UnsupportedEncodingException {
       Map<String, String> query_pairs = new LinkedHashMap<String, String>();
       String[] pairs = data.split("&");
       for (String pair : pairs) {
           int idx = pair.indexOf("=");
           query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
       }
       return query_pairs;
    }

}


