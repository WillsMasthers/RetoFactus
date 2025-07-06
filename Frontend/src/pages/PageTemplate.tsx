
import Header from '../components/Header'
import Section from '../components/common/Section'
import Container from '../components/common/Container'
import PageTitle from '../components/common/PageTitle'
import { NoHeader } from '../components/NoHeader'
import Footer from '../components/Footer'
import Paragraph from '../components/common/Text'


function PageTemplate() {
  return (
    <Container>
      <Header />
      <NoHeader />
      <main className="flex-1">
        <div className="p-4">
          <Section className="mb-8">
            <PageTitle
              title={"Pagina de ejemplo"}
              description={"Esta es una pagina de ejemplo"}
              size={'md'}
              align={'center'}
            />
          </Section>
          <Section className="mb-8" title='Ejemplo de contenido'>
            <Paragraph>Contenido de la sección</Paragraph>
          </Section>
        </div>
      </main>
      <Footer />
    </Container>
  )
}

export default PageTemplate 