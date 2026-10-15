import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Magnetic from '../ui/Magnetic';
import { useAuth } from '../../hooks/useAuth';

const CtaBand = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginDemo } = useAuth();

  return (
    <section className="bg-lime text-coal">
      <div className="shell grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:items-end">
        <h2 data-split className="display-lg lg:col-span-8">
          Your next skill starts with a single twelve-minute lesson.
        </h2>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end" data-reveal>
          <Magnetic>
            <Button
              to={isAuthenticated ? '/courses' : '/signup'}
              size="lg"
              icon={ArrowRight}
              className="!bg-coal !text-cream"
            >
              {isAuthenticated ? 'Find a course' : 'Create free account'}
            </Button>
          </Magnetic>
          <Button
            size="lg"
            variant="outline"
            className="!border-coal/30 !text-coal hover:!border-coal"
            onClick={() => {
              if (!isAuthenticated) loginDemo();
              navigate('/dashboard');
            }}
          >
            Explore the demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaBand;
