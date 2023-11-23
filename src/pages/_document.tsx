import createEmotionCache from '@/utils/createEmotionCache'
import createEmotionServer from '@emotion/server/create-instance'
import Document, {
    DocumentContext,
    Head,
    Html,
    Main,
    NextScript
} from 'next/document'

export default function MyDocument(props: any) {
    return (
        <Html lang='en'>
            <Head>
                <link rel='icon' href='data:.' />
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link rel='preconnect' href='https://fonts.gstatic.com' />
                <link
                    href='https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap'
                    rel='stylesheet'
                />
                <meta name='emotion-insertion-point' content='' />
                {props.emotionStyleTags}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

MyDocument.getInitialProps = async (docContext: DocumentContext) => {
    const originalRenderPage = docContext.renderPage

    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    docContext.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App: any) =>
                function EnhanceApp(props) {
                    return <App emotionCache={cache} {...props} />
                }
        })

    const docProps = await Document.getInitialProps(docContext)
    const emotionStyles = extractCriticalToChunks(docProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ))

    return {
        ...docProps,
        emotionStyleTags
    }
}