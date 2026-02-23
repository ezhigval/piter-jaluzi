'use client'

import { useState, useEffect } from 'react'
import { SEOData } from '@/types/seo'
import { validateSEO } from '@/lib/seo-utils'

interface SEOAnalysisProps {
  seo: SEOData
  pageUrl?: string
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
}

export default function SEOAnalysis({ seo, pageUrl }: SEOAnalysisProps) {
  const [analysis, setAnalysis] = useState<SEOIssue[]>([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    const issues: SEOIssue[] = []
    let currentScore = 100

    // Validate SEO
    const validation = validateSEO(seo)
    
    // Add validation errors and warnings
    validation.errors.forEach(error => {
      issues.push({
        type: 'error',
        message: error,
        suggestion: getErrorSuggestion(error)
      })
      currentScore -= 20
    })

    validation.warnings.forEach(warning => {
      issues.push({
        type: 'warning',
        message: warning,
        suggestion: getWarningSuggestion(warning)
      })
      currentScore -= 10
    })

    // Additional checks
    if (!seo.ogImage) {
      issues.push({
        type: 'warning',
        message: 'Отсутствует OG изображение',
        suggestion: 'Добавьте изображение для лучшего отображения в соцсетях'
      })
      currentScore -= 5
    }

    if (!seo.canonicalUrl && pageUrl) {
      issues.push({
        type: 'info',
        message: 'Рекомендуется добавить canonical URL',
        suggestion: `Добавьте: ${pageUrl}`
      })
      currentScore -= 3
    }

    if (seo.title && seo.title.length > 65) {
      issues.push({
        type: 'warning',
        message: 'Заголовок слишком длинный для мобильных устройств',
        suggestion: 'Сократите заголовок до 65 символов'
      })
      currentScore -= 5
    }

    if (seo.description && seo.description.length > 160) {
      issues.push({
        type: 'warning',
        message: 'Описание может обрезаться в поисковой выдаче',
        suggestion: 'Сократите описание до 160 символов'
      })
      currentScore -= 5
    }

    // Check keyword density (if page content is available)
    if (seo.keywords && seo.keywords.length > 0) {
      if (seo.keywords.length < 3) {
        issues.push({
          type: 'info',
          message: 'Рекомендуется добавить больше ключевых слов',
          suggestion: 'Добавьте 5-10 релевантных ключевых слов'
        })
        currentScore -= 3
      }
    } else {
      issues.push({
        type: 'warning',
        message: 'Отсутствуют ключевые слова',
        suggestion: 'Добавьте релевантные ключевые слова для улучшения SEO'
      })
      currentScore -= 10
    }

    setAnalysis(issues)
    setScore(Math.max(0, currentScore))
  }, [seo, pageUrl])

  function getErrorSuggestion(error: string): string {
    if (error.includes('title')) return 'Добавьте уникальный заголовок страницы (30-60 символов)'
    if (error.includes('description')) return 'Добавьте описание страницы (120-160 символов)'
    if (error.includes('URL')) return 'Проверьте правильность URL'
    return 'Исправьте указанную проблему'
  }

  function getWarningSuggestion(warning: string): string {
    if (warning.includes('короткий')) return 'Увеличьте длину для лучшей оптимизации'
    if (warning.includes('длинный')) return 'Сократите текст до рекомендуемой длины'
    if (warning.includes('ключевых')) return 'Добавьте релевантные ключевые слова'
    return 'Обратите внимание на эту рекомендацию'
  }

  function getScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  function getScoreLabel(score: number): string {
    if (score >= 90) return 'Отлично'
    if (score >= 70) return 'Хорошо'
    if (score >= 50) return 'Удовлетворительно'
    return 'Требует улучшения'
  }

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">SEO Оценка</h3>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-sm text-gray-600">{getScoreLabel(score)}</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              score >= 90 ? 'bg-green-500' :
              score >= 70 ? 'bg-yellow-500' :
              score >= 50 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Issues */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Анализ и рекомендации</h3>
        
        {analysis.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-medium">Отлично!</p>
                <p className="text-green-700 text-sm">SEO оптимизация выполнена на высоком уровне</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {analysis.map((issue, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 ${
                  issue.type === 'error' ? 'bg-red-50 border-red-200' :
                  issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <div className={`${
                    issue.type === 'error' ? 'text-red-600' :
                    issue.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {issue.type === 'error' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {issue.type === 'warning' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {issue.type === 'info' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`font-medium ${
                      issue.type === 'error' ? 'text-red-800' :
                      issue.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {issue.message}
                    </p>
                    {issue.suggestion && (
                      <p className={`text-sm mt-1 ${
                        issue.type === 'error' ? 'text-red-700' :
                        issue.type === 'warning' ? 'text-yellow-700' :
                        'text-blue-700'
                      }`}>
                        💡 {issue.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{seo.title?.length || 0}</div>
          <div className="text-sm text-gray-600">Символов в title</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{seo.description?.length || 0}</div>
          <div className="text-sm text-gray-600">Символов в description</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{seo.keywords?.length || 0}</div>
          <div className="text-sm text-gray-600">Ключевых слов</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{analysis.filter(i => i.type === 'error').length}</div>
          <div className="text-sm text-gray-600">Критичных ошибок</div>
        </div>
      </div>
    </div>
  )
}
