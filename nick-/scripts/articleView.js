'use strict';
//clears out false positive errors for designated variables "articles".
/*global articles*/

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
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENTED: Where is this function called? Why?
// This function is called at the bottom of the new.html page because that it where it is utilized.
articleView.initNewArticlePage = () => {
  // TODONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').show();

  // TODONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.

  $('#article-json').on('focus', function(){
    this.select();
  });

  // TODONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-article-form').on('change', function() {
    let articleTitle = $('#title').val();
    let articleBody = $('#body').val();
    let articleAuthor = $('#author').val();
    let articleUrl = $('#url').val();
    let articleCategory = $('#category').val();
    let articleJSON = 
    articleView.create();
    articleView.handleMainNav();
  });
};

articleView.create = () => {
  // TODONE: Set up a variable to hold the new article we are creating.
  let newArticleData = {
    author : $('#author').val(),
    authorUrl : $('#url').val(),
    title : $('#title').val(),
    category : $('#category').val(),
    body: $('#body').val(),
    publishedOn: '(Draft)',
  }
  if ($('#is-published').is(':checked')) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    newArticleData.publishedOn = `${mm}-${dd}-${yyyy}`;
  }
  // TODONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  $('#artilces').empty(); //clears previous data from last update.

  let newArticleData = {
    title: $('#title').val(),
    body: $('#body').val(),
    author: $('#author').val(),
    authorURL: $('#author-url').val(),
    category: $('#category').val(), //what about published
    publishedOn: $('#article-published:checked').length ? new Date() : null
  };

  // TODONE: Instantiate an article based on what's in the form fields:
  let newArticle = new Article(newArticleData);

  // TODONE: Use our interface to the Handblebars template to put this new article into the DOM:
  $('#articles').append(newArticle.toHtml());

  // TODONE: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // TODONE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#source-code code').text(JSON.stringify(newArticleData, null, '\t'));
};

// COMMENTED: Where is this function called? Why?
// on the index page to create the new page elements
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
