import React, { useRef, useEffect, useState } from 'react';
import { Download, FileType, Image } from 'lucide-react';
import styles from '../../../css/styles/admin/AnnouncementEditor.module.css';

const AnnouncementEditor = () => {
  const editorRef = useRef(null);
  const summernoteInitialized = useRef(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    // Load jQuery and Summernote from CDN
    const loadScripts = async () => {
      if (!window.jQuery) {
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        jqueryScript.async = true;
        document.body.appendChild(jqueryScript);

        await new Promise(resolve => {
          jqueryScript.onload = resolve;
        });
      }

      if (!document.querySelector('link[href*="summernote"]')) {
        const summernoteCSS = document.createElement('link');
        summernoteCSS.rel = 'stylesheet';
        summernoteCSS.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css';
        document.head.appendChild(summernoteCSS);
      }

      if (!window.$.summernote) {
        const summernoteScript = document.createElement('script');
        summernoteScript.src = 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js';
        summernoteScript.async = true;
        document.body.appendChild(summernoteScript);

        await new Promise(resolve => {
          summernoteScript.onload = resolve;
        });
      }

      // Load html2canvas for image export
      if (!window.html2canvas) {
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        html2canvasScript.async = true;
        document.body.appendChild(html2canvasScript);

        await new Promise(resolve => {
          html2canvasScript.onload = resolve;
        });
      }

      // Initialize Summernote
      initializeSummernote();
    };

    loadScripts();

    // Cleanup function
    return () => {
      if (editorRef.current && summernoteInitialized.current) {
        const $ = window.jQuery;
        $(editorRef.current).summernote('destroy');
        summernoteInitialized.current = false;
      }
    };
  }, []);

  // Effect to update background color when it changes
  useEffect(() => {
    if (summernoteInitialized.current && window.jQuery) {
      const $ = window.jQuery;
      $('.note-editing-area').css('background-color', backgroundColor);
      
      // Re-check content limits when background changes
      enforceContentLimits($);
    }
  }, [backgroundColor]);

  // Function to enforce content limits (extracted to be used in multiple places)
  const enforceContentLimits = ($) => {
    if (!$) $ = window.jQuery; // Ensure $ is defined
    if (!$) return; // Exit if jQuery still not available
    
    const $editArea = $('.note-editable');
    const $indicator = $('.content-limit-indicator');
    
    if (!$editArea.length || !$indicator.length) return;
    
    // Check if content exceeds the visible area
    const scrollHeight = $editArea[0].scrollHeight;
    const clientHeight = $editArea[0].clientHeight;
    
    if (scrollHeight > clientHeight) {
      // Content exceeds visible area
      $indicator.show();
    } else {
      $indicator.hide();
    }
  };

  const initializeSummernote = () => {
    if (!window.jQuery || !editorRef.current || summernoteInitialized.current) return;
    
    const $ = window.jQuery;
    $(editorRef.current).summernote({
      placeholder: 'Type your announcement here...',
      tabsize: 2,
      height: 398, // Updated height
      width: 1026,  // Updated width
      styleTags: ['p', 'h1', 'h2', 'h3', 'h4'],
      toolbar: [
        ['style', ['style']],
        ['misc', ['codeview', 'undo', 'redo', 'help', 'removeFormat']],
        ['font', ['bold', 'underline', 'italic']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link']]
      ],
      callbacks: {
        onChange: function(contents) {
          // Enforce content limits when content changes
          setTimeout(() => enforceContentLimits($), 0);
        },
        onInit: function() {
          setTimeout(() => {
            // Add visual overflow indicator
            const $editArea = $('.note-editable');
            const $editingArea = $('.note-editing-area');
            
            // Only add indicator if it doesn't exist yet
            if ($('.content-limit-indicator').length === 0) {
              const $indicator = $('<div class="content-limit-indicator" style="display: none; position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(255,0,0,0.1)); height: 30px; pointer-events: none; text-align: center; padding-top: 10px;"><span style="background: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; color: #d32f2f;">Content exceeds visible area</span></div>');
              $editingArea.css('position', 'relative').append($indicator);
            }
            
            // Add custom clear format button if needed
            if (!$('.note-btn[data-event="removeFormat"]').length) {
              const $toolbar = $('.note-toolbar');
              const $clearBtn = $('<button type="button" class="note-btn btn btn-light btn-sm" title="Clear Formatting" data-event="removeFormat">' +
                                '<i class="note-icon-eraser"></i>' +
                                '</button>');
              
              $clearBtn.on('click', function() {
                $(editorRef.current).summernote('removeFormat');
              });
              
              $toolbar.find('.note-font-group').after(
                $('<div class="note-btn-group btn-group note-clear-group"></div>').append($clearBtn)
              );
            }
            
            // Add line counter to show visual representation of line limit
            if ($('.line-counter').length === 0) {
              const $lineCounter = $('<div class="line-counter" style="position: absolute; top: 5px; right: 5px; background: rgba(255,255,255,0.8); border-radius: 4px; padding: 2px 8px; font-size: 12px; color: #666;"></div>');
              $editingArea.append($lineCounter);
              
              // Update line counter on content change
              $editArea.on('keyup mouseup', function() {
                const lineCount = $editArea.html().split(/<\/p>|<br>|<br\/>/gi).length;
                const maxLines = 12; // Updated for larger area
                $lineCounter.html(`Lines: ${lineCount}/${maxLines}`);
                
                if (lineCount > maxLines) {
                  $lineCounter.css('color', '#d32f2f');
                } else {
                  $lineCounter.css('color', '#666');
                }
              });
              
              // Trigger initial count
              $editArea.trigger('keyup');
            }
            
            // Set initial content limits
            enforceContentLimits($);
          }, 100);
        }
      }
    });
    
    // Add custom class to editor and set initial background color and dimensions
    $('.note-editing-area').addClass(styles['editor-content']);
    $('.note-editing-area').css({
      'background-color': backgroundColor,
      'width': '1026px',
      'height': '398px',
      'overflow': 'hidden' // Change from 'auto' to 'hidden' for the export view
    });
    
    $('.note-editable').css({
      'height': '358px', // 398px - 40px for padding
      'max-height': '358px',
      'overflow': 'auto', // Keep auto scroll for editing
      'padding': '20px'
    });
    
    // Fix the editor container width
    $('.note-editor').css({
      'width': '1026px',
      'margin': '0 auto'
    });
    
    summernoteInitialized.current = true;
  };

  // Save as HTML file
  const saveAsHTML = () => {
    const $ = window.jQuery;
    const content = $(editorRef.current).summernote('code');
    
    // Create a temporary div to get only visible content
    const tempDiv = $('<div></div>').html(content).css({
      'width': '986px', // 1026px - 40px padding
      'max-height': '358px',
      'overflow': 'hidden',
      'position': 'absolute',
      'left': '-9999px',
      'top': '-9999px'
    }).appendTo('body');
    
    // Get only visible content
    const visibleContent = tempDiv.html();
    tempDiv.remove();
    
    // Create HTML document with proper styling
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Announcement</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .announcement-container {
            width: 1026px;
            height: 398px;
            margin: 0 auto;
            padding: 20px;
            background-color: ${backgroundColor};
            box-sizing: border-box;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="announcement-container">
          ${visibleContent}
        </div>
      </body>
    </html>
    `;
    
    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'announcement.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Save as PNG image
  const saveAsImage = async () => {
    const $ = window.jQuery;
    if (!window.html2canvas) {
      alert('Image export library not loaded. Please try again.');
      return;
    }
    
    // Get content
    const content = $(editorRef.current).summernote('code');
    
    // Create a temporary div to get only visible content
    const tempDiv = $('<div></div>').html(content).css({
      'width': '986px', // 1026px - 40px padding
      'max-height': '358px',
      'overflow': 'hidden',
      'position': 'absolute',
      'left': '-9999px',
      'top': '-9999px'
    }).appendTo('body');
    
    // Get only visible content
    const visibleContent = tempDiv.html();
    tempDiv.remove();
    
    // Create a temporary container for rendering with fixed dimensions
    const container = document.createElement('div');
    container.style.width = '1026px';
    container.style.height = '398px';
    container.style.padding = '20px';
    container.style.backgroundColor = backgroundColor;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.boxSizing = 'border-box';
    container.style.overflow = 'hidden';
    container.innerHTML = visibleContent;
    document.body.appendChild(container);
    
    try {
      // Convert the container to canvas with fixed dimensions
      const canvas = await window.html2canvas(container, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: backgroundColor,
        width: 1026,
        height: 398
      });
      
      // Convert canvas to image and download
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'announcement.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  };

  // Handle color picker change
  const handleColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  return (
    <div className={styles.panel}>
      <div className={styles['panel-header']}>
        <h2 className="text-2xl font-bold">Announcement Editor</h2>
      </div>
      <div className={styles['panel-content']}>
        <div className={styles['editor-controls']}>
          <div className={styles['color-picker-container']}>
            <label htmlFor="bgColorPicker">Background Color: </label>
            <input
              id="bgColorPicker"
              type="color"
              value={backgroundColor}
              onChange={handleColorChange}
              className={styles['color-picker']}
            />
          </div>
          <div className={styles['dimensions-info']}>
            <span>Fixed size: 1026px × 398px (max 10 lines at 16px)</span>
          </div>
        </div>
        <div className={styles['editor-wrapper']}>
          <div>
            {/* This div will be replaced by Summernote */}
            <div ref={editorRef}></div>
          </div>

          <div className={styles['button-container']}>
            <button 
              className={`${styles['export-button']} ${styles['html-button']}`}
              onClick={saveAsHTML}
            >
              <FileType size={20} />
              <span>Save as HTML</span>
            </button>
            <button 
              className={`${styles['export-button']} ${styles['image-button']}`}
              onClick={saveAsImage}
            >
              <Image size={20} />
              <span>Save as PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementEditor;