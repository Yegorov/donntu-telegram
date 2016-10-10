const cheerio = require('cheerio')
const request = require('request')
const moment = require('moment')
const UA = 'Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) ' +
           'AppleWebKit/124 (KHTML, like Gecko) Safari/125'

function printNew(arrNews, arrEvents) {
  console.log(arrNews)
  console.log('\n')
  console.log(arrEvents)
}

function printOneNew(objNew) {
  console.log(objNew)
}

function grabNew(options, callback, objNew) {
  const BASE_URL = 'http://donntu.org/news'
  options = (options == null) ? {} : options

  request({
    url: options.url || BASE_URL + "/" + objNew.content_id,
    headers: {
      'User-Agent': options.userAgent || UA
    }
  }, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      $ = cheerio.load(body)
      var selMain = 'div.l-content'
      var selTextContent = 'div.field--name-body.field--type-text-with-summary p'
      var selTags = 'div.field--name-field-tags.field--type-taxonomy-term-reference a'

      var textContent = ""
      var arrP = []
      try {
        $(selTextContent, selMain).each(function(i, el) {
          arrP.push($(el).text().replace(/\s+/g, " "))
        })
        textContent = arrP.join("\n")
      } catch(err) {
        console.log(err)
        console.log(objNew)
      }

      var arrTags = []
      $(selTags, selMain).each(function(i, el) {
        $el = $(el)
        try {
          arrTags.push({
            tag_ru: $el.text().trim(),
            tag_en: $el.attr('href').match(/\/t[ea]g[is]\/(.+)/)[1].trim()
          })
        } catch(err) {
          console.log(err)
          console.log(objNew)
        }
      })
      if(callback) {
        if(objNew) {
          objNew.text_content = textContent
          objNew.tags = arrTags
          callback(objNew)
        }
        else {
          callback({
            text_content: textContent,
            tags: arrTags
          })
        }
      }
      //console.log(textContent)
      //console.log(arrTags)
    }
    else {
      if(callback) {
        callback({});
      }
    }
  })
}

function grabNews(options, callback) {
  const NEWS_URL = 'http://donntu.org/news'
  options = (options == null) ? {} : options
  request({
    url: options.url || NEWS_URL,
    headers: {
      'User-Agent': options.userAgent || UA
    }
  }, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      $ = cheerio.load(body)
      var selMain = 'div#quicktabs-tabpage-news-0 div.view-content > div.news-main'
      var selDate = 'div.views-field-created > span.field-content'
      var selTitle = 'div.views-field-title > span.field-content > a'
      var selTextPreview = 'div.views-field-body > span.field-content'
      var selUrlImg = 'div.views-field-field-image > div.field-content > a > img'
      var selCountView = 'div.views-field-totalcount > span.field-content'

      var selEvent = 'div#block-views-main-news-block-7 div.view-content > div.news-main'
      var selDateEvent = 'div.views-field-field-announce-date > div.field-content > a > span'
      var selTitleEvent = 'div.views-field-field-announce > div.field-content > a'

      var arrNews = []
      var arrEvents = []

      $(selMain).each(function(i, el) {
        var title = $(selTitle, el).text()
        var id = $(selTitle, el).attr('href').match(/\/news\/([id]*\d+)/)[1]
        var date = $(selDate, el).text()
        date = moment(date, "DD MMMM, YYYY - HH:mm", "ru").format()
        var textPreview = $(selTextPreview, el).text()
        var imgUrl = $(selUrlImg, el).attr('src')
        var countView = $(selCountView, el).text()

        arrNews.push({
          title: title,
          content_id: id,
          date_created: date,
          text_preview: textPreview,
          image_url: imgUrl,
          count_view: parseInt(countView)
        })

        /*callback({
                  title: title,
                  id: id,
                  date: date,
                  textPreview: textPreview,
                  imageUrl: imgUrl,
                  countView: countView
                })
       */
      })

      $(selEvent).each(function(i, el) {
        var title = $(selTitleEvent, el).text()
        var id = $(selTitleEvent, el).attr('href').match(/.*\/news\/([id]*\d+)/)[1]
        var date = $(selDateEvent, el).attr('content')

        arrEvents.push({
          title: title,
          content_id: id,
          date_created: date
        })
      })

      callback(arrNews, arrEvents)
    }
    else {
      console.log("Error in grabber: ", response)
    }
  })
}

module.exports = {
  grabNews: grabNews,
  grabNew: grabNew
};
