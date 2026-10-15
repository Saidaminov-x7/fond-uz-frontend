import { Container } from "@/src/components/ui/Container";

type Props = { title: string; text: string; highlights: [string, string, string] | string[] };

export function ActivitySection({ title, text, highlights }: Props) {
  return (
    <section className="activity-section py-16 md:py-24">
      <Container>
        <div className="activity-intro">
          <p className="section-kicker">FondUz</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <ol className="activity-steps">
          {highlights.map((item, index) => (
            <li className="activity-step" key={item}>
              <span className="activity-step-number">0{index + 1}</span>
              <p>{item}</p>
              <span className="activity-step-arrow" aria-hidden="true">↗</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
