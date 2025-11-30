package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

func main() {
	staticDir := getEnv("STATIC_DIR", "build")
	addr := ":" + getEnv("PORT", "8080")

	mux := http.NewServeMux()
	mux.Handle("/healthz", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	}))

	mux.Handle("/", spaHandler(staticDir))

	server := &http.Server{
		Addr:              addr,
		Handler:           loggingMiddleware(mux),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("serving static files from %s on %s", staticDir, addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func spaHandler(staticDir string) http.Handler {
	fileServer := http.FileServer(http.Dir(staticDir))
	indexFile := filepath.Join(staticDir, "index.html")

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cleanPath := filepath.Clean(r.URL.Path)
		relativePath := strings.TrimPrefix(cleanPath, "/")

		// serve static assets directly when present
		path := filepath.Join(staticDir, relativePath)
		if info, err := os.Stat(path); err == nil {
			if info.IsDir() {
				index := filepath.Join(path, "index.html")
				if _, err := os.Stat(index); err == nil {
					serveHTMLNoCache(w, r, index)
					return
				}
			}

			if !info.IsDir() {
				fileServer.ServeHTTP(w, r)
				return
			}
		}

		// if request targets a file extension but does not exist, return 404
		if strings.Contains(filepath.Base(cleanPath), ".") {
			http.NotFound(w, r)
			return
		}

		serveHTMLNoCache(w, r, indexFile)
	})
}

func serveHTMLNoCache(w http.ResponseWriter, r *http.Request, file string) {
	f, err := os.Open(file)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	defer f.Close()

	info, err := f.Stat()
	if err != nil {
		http.NotFound(w, r)
		return
	}

	// prevent browsers from caching index.html so hashed asset URLs always refresh
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Content-Length", strconv.FormatInt(info.Size(), 10))

	if r.Method == http.MethodHead {
		w.WriteHeader(http.StatusOK)
		return
	}

	if _, err := io.Copy(w, f); err != nil {
		log.Printf("error serving %s: %v", file, err)
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}
