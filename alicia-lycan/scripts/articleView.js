'use strict';

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
    if ($(this).hasClass('read-on')) {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
      $(this).addClass('read-less');
      $(this).removeClass('read-on');
    } 
    else if ($(this).hasClass('read-less')) {
      $(this).addClass('read-on');
      $(this).removeClass('read-less');
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENTED: Where is this function called? Why?
// The function is called in the new.html page to display the data on the page.
articleView.initNewArticlePage = () => { //initialize 'wire everything up', dom and scripts are loaded.
  // TODONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('.tab-content').show();

  // TODONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.

  $('#article-json').on('focus', function(){
    this.select(function() {
      let exportArticle = $(this).val();
    });
  });

  // TODONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-article-form').on('change', 'input, textarea', function() {
    let exportArticle = $(this).val();
    articleView.create();
  });
  //listen for changes on the form (expects event type string and delegated selection) and do something (trigger the function = when a change happens run function: articleView.create) with the changes = pass through a callback function.

  $('#article-json').on('change', 'input textarea', function() {
    articleView.create();
  });

  articleView.handleMainNav();
};

articleView.create = () => {
  // TODONE: Set up a variable to hold the new article we are creating.
  // Clear out the #articles element, so we can put in the updated preview
  $('#article-preview').empty(); //need to remove content of articles first
  let newArticleObj = {
    title: $('#title').val(),
    category: $('#category').val(),
    author: $('#author').val(), 
    authorUrl: $('#author-url').val(),
    body: $('#body').val(),       
    publishedOn: $('#published').val()
    //publishedOn: $('#published:checked').length ? new Date() : null //ask the element, returns an array. Article is getting keys and values that match what it expects
  };

  // TODONE: Instantiate an article based on what's in the form fields:
  function Article(articleObj) {
    this.author = articleObj.author;
    this.authorUrl = articleObj.authorUrl;
    this.title = articleObj.title;
    this.category = articleObj.category;
    this.body = articleObj.body;
    this.publishedOn = articleObj.publishedOn;

    $('#published').on('click', function() {
      if($('#published').prop('checked')) {
        $(this).val('2017-01-08');
      }
      else {
        $(this).val('');
      }
    });
  
    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  }

  let newArticle = new Article(newArticleObj);

  // TODONE: Use our interface to the Handblebars template to put this new article into the DOM:
  let template = Handlebars.compile($('#new-article-template').html());
  template(newArticle);
  $('#article-preview').append(template(newArticle)).show();

  // TODONE STRETCH: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // TODONE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  let json = JSON.stringify(newArticle); //want to see new article in JSON form
  $('#article-json').val(json);

};

// COMMENTED: Where is this function called? Why?
// The function is called in index.html to create new elements for the pages.
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};