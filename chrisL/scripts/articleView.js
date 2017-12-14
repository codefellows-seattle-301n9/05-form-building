'use strict';
/* global articles */

let articleView = {};

articleView.populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(event) {
    event.preventDefault();
    if($(this).text() === 'Read On &rarr;') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    }
    else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read On &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENTED: Where is this function called? Why?
// This function is called in new.html in order to initialize the page.
articleView.initNewArticlePage = () => {
  // TODONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').show();

  // TODO: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.

  $('#article-json').on('focus', function() {
    console.log('in focus!');
    $(this).select(function() {
      console.log('something selected!');
      console.log($(this).val());
    });

  });

  // TODO: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-article-form').on('change', 'input, textarea', function() {
    console.log('Change Detected!');
    let newText = $(this).val();
    console.log(newText);
    articleView.create();
  });

  $('#article-export').on('change', 'textarea', function() {

  });
  articleView.handleMainNav();
};

articleView.create = () => {
  // TODONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  $('#article-preview').empty();

  let newArticleObj = {
    author: $('#author').val(),
    authorUrl: $('#author-url').val(),
    title: $('#title').val(),
    category: $('#category').val(),
    body: $('#body').val(),
    publishedOn: $('#published').prop('checked')
  };

  // TODONE: Instantiate an article based on what's in the form fields:
  function CreateArticle(articleObj) {
    this.author = articleObj.author;
    this.authorUrl = articleObj.authorUrl;
    this.title = articleObj.title;
    this.category = articleObj.category;
    this.body = articleObj.body;
    this.publishedOn = articleObj.publishedOn;

    //this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? `${$('#published').val()}` : '(draft)';
  }
  let newArticle = new CreateArticle(newArticleObj);

  // TODONE: Use our interface to the Handblebars template to put this new article into the DOM:
  let template = Handlebars.compile($('#new-article-template').html());
  template(newArticle);
  $('#article-preview').append(template(newArticle)).show();

  // TODO: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each();

  // TODO: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
};

// COMMENTED: Where is this function called? Why?
// To initialize the index.html page and run these functions for the page as well when it is called.
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
}