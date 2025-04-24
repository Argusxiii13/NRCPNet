import React, { useRef, useEffect, useState } from 'react';
import { Download, FileType, Image } from 'lucide-react';
import styles from '../../../css/styles/admin/AnnouncementEditor.module.css';

const AnnouncementEditor = () => {
  const editorRef = useRef(null);
  const summernoteInitialized = useRef(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
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

      if (!window.html2canvas) {
        const html2canvasScript = document.createElement('script');
        html2canvasScript.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        html2canvasScript.async = true;
        document.body.appendChild(html2canvasScript);

        await new Promise(resolve => {
          html2canvasScript.onload = resolve;
        });
      }

      initializeSummernote();
    };

    loadScripts();

    return () => {
      if (editorRef.current && summernoteInitialized.current) {
        const $ = window.jQuery;
        $(editorRef.current).summernote('destroy');
        summernoteInitialized.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (summernoteInitialized.current && window.jQuery) {
      const $ = window.jQuery;
      $('.note-editing-area').css('background-color', backgroundColor);
      enforceContentLimits($);
    }
  }, [backgroundColor]);

  const enforceContentLimits = ($) => {
    if (!$) $ = window.jQuery;
    if (!$) return;

    const $editArea = $('.note-editable');
    const $indicator = $('.content-limit-indicator');

    if (!$editArea.length || !$indicator.length) return;

    const scrollHeight = $editArea[0].scrollHeight;
    const clientHeight = $editArea[0].clientHeight;

    if (scrollHeight > clientHeight) {
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
      height: 500,
      width: 1120,
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
          setTimeout(() => enforceContentLimits($), 0);
        },
        onInit: function() {
          setTimeout(() => {
            const $editArea = $('.note-editable');
            const $editingArea = $('.note-editing-area');

            if ($('.content-limit-indicator').length === 0) {
              const $indicator = $('<div class="content-limit-indicator" style="display: none; position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(255,0,0,0.1)); height: 30px; pointer-events: none; text-align: center; padding-top: 10px;"><span style="background: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; color: #d32f2f;">Content exceeds visible area</span></div>');
              $editingArea.css('position', 'relative').append($indicator);
            }

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

            if ($('.line-counter').length === 0) {
              const $lineCounter = $('<div class="line-counter" style="position: absolute; top: 5px; right: 5px; background: rgba(255,255,255,0.8); border-radius: 4px; padding: 2px 8px; font-size: 12px; color: #666;"></div>');
              $editingArea.append($lineCounter);

              $editArea.on('keyup mouseup', function() {
                const lineCount = $editArea.html().split(/<\/p>|<br>|<br\/>/gi).length;
                const maxLines = 12;
                $lineCounter.html(`Lines: ${lineCount}/${maxLines}`);

                if (lineCount > maxLines) {
                  $lineCounter.css('color', '#d32f2f');
                } else {
                  $lineCounter.css('color', '#666');
                }
              });

              $editArea.trigger('keyup');
            }

            enforceContentLimits($);
          }, 100);
        }
      }
    });

    $('.note-editing-area').addClass(styles['editor-content']);
    $('.note-editing-area').css({
      'background-color': backgroundColor,
      'width': '1120px',
      'height': '500px',
      'overflow': 'hidden'
    });

    $('.note-editable').css({
      'height': '500px',
      'max-height': '500px',
      'overflow': 'auto',
      'padding': '20px',
      'overflow-wrap': 'break-word',
      'white-space': 'pre-wrap',
      'line-height': '1.5',
      'font-size': '16px',
      'font-family': 'Arial, sans-serif'
    });

    $('.note-editor').css({
      'width': '1120px',
      'margin': '0 auto'
    });

    summernoteInitialized.current = true;
  };

  const saveAsHTML = () => {
    const $ = window.jQuery;
    const content = $(editorRef.current).summernote('code');

    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Announcement</title>
    <style>
      /* CSS Reset */
      html, body, div, span, applet, object, iframe,
      h1, h2, h3, h4, h5, h6, p, blockquote, pre,
      a, abbr, acronym, address, big, cite, code,
      del, dfn, em, img, ins, kbd, q, s, samp,
      small, strike, strong, sub, sup, tt, var,
      b, u, i, center,
      dl, dt, dd, ol, ul, li,
      fieldset, form, label, legend,
      table, caption, tbody, tfoot, thead, tr, th, td,
      article, aside, canvas, details, embed,
      figure, figcaption, footer, header, hgroup,
      menu, nav, output, ruby, section, summary,
      time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
      }
      /* HTML5 display-role reset for older browsers */
      article, aside, details, figcaption, figure,
      footer, header, hgroup, menu, nav, section {
        display: block;
      }
      body {
        line-height: 1;
      }
      ol, ul {
        list-style: none;
      }
      blockquote, q {
        quotes: none;
      }
      blockquote:before, blockquote:after,
      q:before, q:after {
        content: '';
        content: none;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }

      /* Announcement Styles */
      body {
        font-family: Arial, sans-serif;
      }
      .announcement-container {
        width: 1120px;
        height: 500px;
        padding: 20px;
        background-color: ${backgroundColor};
        overflow: hidden;
        box-sizing: border-box;
        overflow-wrap: break-word;
        white-space: pre-wrap;
        line-height: 1.5;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <div class="announcement-container">
      ${content}
    </div>
  </body>
</html>
`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'announcement.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const saveAsImage = async () => {
    const $ = window.jQuery;
    if (!window.html2canvas) {
      alert('Image export library not loaded. Please try again.');
      return;
    }

    const content = $(editorRef.current).summernote('code');

    const container = document.createElement('div');
    container.style.width = '1120px';
    container.style.height = '500px';
    container.style.padding = '20px';
    container.style.backgroundColor = backgroundColor;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.boxSizing = 'border-box';
    container.style.overflow = 'hidden';
    container.style.overflowWrap = 'break-word';
    container.style.whiteSpace = 'pre-wrap';
    container.style.lineHeight = '1.5';
    container.style.fontSize = '16px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.innerHTML = content;
    document.body.appendChild(container);

    try {
      const canvas = await window.html2canvas(container, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: backgroundColor,
        width: 1120,
        height: 500,
        logging: false,
        scale: 1 // Important for consistent rendering
      });

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
      document.body.removeChild(container);
    }
  };

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
            <span>Fixed size: 1120px × 500px</span>
          </div>
        </div>
        <div className={styles['editor-wrapper']}>
          <div>
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
